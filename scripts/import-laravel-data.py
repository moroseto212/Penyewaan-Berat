#!/usr/bin/env python3
"""
Konversi dump MySQL (Laravel) menjadi SQL yang bisa dijalankan di Supabase.

Menghasilkan satu file SQL berisi data konten dengan id asli dipertahankan,
sehingga relasi antar tabel tetap konsisten.

Penggunaan:
    python scripts/import-laravel-data.py <path-dump-mysql.sql>

Hasil:
    supabase/data/import-laravel-content.sql
    supabase/data/import-report.md

Catatan:
- Tabel `users` dan tabel infrastruktur Laravel (cache, jobs, sessions, dst.)
  sengaja dilewati; autentikasi pindah ke Supabase Auth.
- Nilai gambar dibiarkan apa adanya. Keduanya sudah berupa URL eksternal
  pada database asli, jadi tidak perlu mengunggah ulang ke Supabase Storage.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path
from urllib.parse import urlparse

# --------------------------------------------------------------------------- #
# Konfigurasi pemetaan
# --------------------------------------------------------------------------- #

ROOT = Path(__file__).resolve().parent.parent
OUT_SQL = ROOT / "supabase" / "data" / "import-laravel-content.sql"
OUT_REPORT = ROOT / "supabase" / "data" / "import-report.md"

# Urutan penting: induk sebelum anak (foreign key).
TABLES = [
    "categories",
    "services",
    "service_areas",
    "testimonials",
    "equipment",
    "equipment_images",
    "projects",
    "project_images",
    "blog_posts",
    "faqs",
    "contacts",
]

SKIP_TABLES = {
    "users",
    "password_reset_tokens",
    "sessions",
    "cache",
    "cache_locks",
    "jobs",
    "job_batches",
    "failed_jobs",
    "migrations",
}

BOOLEAN_COLUMNS = {"is_active", "is_featured", "is_read", "is_published"}
JSONB_COLUMNS = {"specifications", "images", "tags"}
TIMESTAMP_COLUMNS = {"created_at", "updated_at", "published_at"}
NOT_NULL_TIMESTAMPS = {"created_at", "updated_at"}
DATE_COLUMNS = {"start_date", "end_date"}
IMAGE_COLUMNS = {"image", "image_path", "photo"}

# --------------------------------------------------------------------------- #
# Parser literal MySQL
# --------------------------------------------------------------------------- #

ESCAPES = {
    "0": "\0",
    "b": "\b",
    "n": "\n",
    "r": "\r",
    "t": "\t",
    "Z": "\x1a",
    "\\": "\\",
    "'": "'",
    '"': '"',
    "%": "\\%",
    "_": "\\_",
}


def split_values(body: str) -> list[str | None]:
    """Memecah `(a,b,'c')` menjadi daftar literal mentah (string atau None)."""
    body = body.strip()
    # Buang kurung pembungkus outermost; sisa koma di dalamnya berada pada
    # kedalaman 0 sehingga bisa dipisah dengan aman.
    if body.startswith("(") and body.endswith(")"):
        body = body[1:-1]

    values: list[str | None] = []
    buf: list[str] = []
    i = 0
    in_string = False
    depth = 0
    length = len(body)

    def flush() -> None:
        raw = "".join(buf).strip()
        buf.clear()
        values.append(None if raw.upper() == "NULL" else raw)

    while i < length:
        ch = body[i]

        if in_string:
            if ch == "\\" and i + 1 < length:
                nxt = body[i + 1]
                buf.append(ESCAPES.get(nxt, nxt))
                i += 2
                continue
            if ch == "'":
                # Tanda kutip ganda di dalam string MySQL = kutip literal.
                if body[i : i + 2] == "''":
                    buf.append("'")
                    i += 2
                    continue
                in_string = False
                i += 1
                continue
            buf.append(ch)
            i += 1
            continue

        if ch == "'":
            in_string = True
            i += 1
            continue
        if ch == "(":
            depth += 1
            i += 1
            continue
        if ch == ")":
            depth -= 1
            i += 1
            continue
        if ch == "," and depth == 0:
            flush()
            i += 1
            continue

        buf.append(ch)
        i += 1

    if "".join(buf).strip():
        flush()

    return values


INSERT_RE = re.compile(
    r"INSERT INTO `(?P<table>\w+)`\s*\((?P<cols>[^)]*)\)\s*VALUES\s*(?P<values>.+?);\s*$",
    re.MULTILINE | re.DOTALL,
)


def parse_dump(path: Path) -> "OrderedDict[str, list[dict[str, str | None]]]":
    text = path.read_text(encoding="utf-8", errors="replace")
    data: OrderedDict[str, list[dict[str, str | None]]] = OrderedDict()

    for match in INSERT_RE.finditer(text):
        table = match.group("table")
        if table in SKIP_TABLES:
            continue
        columns = [c.strip().strip("`") for c in match.group("cols").split(",")]
        values = split_values(match.group("values").strip())

        rows = data.setdefault(table, [])
        for start in range(0, len(values), len(columns)):
            chunk = values[start : start + len(columns)]
            if len(chunk) != len(columns):
                break
            rows.append(dict(zip(columns, chunk)))

    return data


# --------------------------------------------------------------------------- #
# Konversi nilai
# --------------------------------------------------------------------------- #


def sql_literal(value: str | None) -> str:
    if value is None:
        return "NULL"
    # Postgres tidak menerima karakter NUL di dalam kolom text.
    cleaned = value.replace("\0", "")
    return "'" + cleaned.replace("'", "''") + "'"


def to_boolean(value: str | None, default: bool | None = None) -> str:
    if value is None:
        return "NULL" if default is None else ("true" if default else "false")
    return "true" if value.strip() not in {"0", "", "false"} else "false"


def _clean_token(value: str) -> str:
    """Buang sisa struktur JSON yang menempel di ujung sebuah token.

    Data lama menyimpan tag sebagai `["[\"konstruksi\"", "\"tips\""]`, sehingga
    tiap elemen masih membawa karakter `[`, `]`, dan `"`.
    """
    return value.strip().strip("[]").strip().strip('"').strip().strip("[]").strip()


def _unwrap_json(value, depth: int = 0):
    """Buka JSON yang ter-encode berulang kali oleh Laravel lama."""
    if depth >= 4:
        return value

    if isinstance(value, str):
        try:
            inner = json.loads(value)
        except json.JSONDecodeError:
            return value
        return _unwrap_json(inner, depth + 1)

    if isinstance(value, list) and value and all(isinstance(item, str) for item in value):
        cleaned = [_clean_token(item) for item in value]
        if cleaned == value:
            return value
        return _unwrap_json(cleaned, depth + 1)

    return value


def to_jsonb(value: str | None, warnings: list[str], table: str, row_id: str) -> str:
    if value is None or value.strip() == "":
        return "NULL"

    try:
        parsed = json.loads(value)
    except json.JSONDecodeError as error:
        warnings.append(
            f"{table}#{row_id}: JSON tidak valid ({error.msg}) -> diisi NULL"
        )
        return "NULL"

    normalized = _unwrap_json(parsed)
    if normalized != parsed:
        warnings.append(
            f"{table}#{row_id}: JSON di-decode dua kali -> dinormalisasi"
        )

    try:
        json.dumps(normalized, ensure_ascii=False)
    except (TypeError, ValueError) as error:
        warnings.append(f"{table}#{row_id}: JSON tidak bisa diserialisasi ({error}) -> NULL")
        return "NULL"

    if normalized is None:
        return "NULL"

    return sql_literal(json.dumps(normalized, ensure_ascii=False, separators=(",", ":"))) + "::jsonb"



def to_timestamp(value: str | None, column: str, warnings: list[str], table: str, row_id: str) -> str:
    if value is None or value.strip() in {"", "0000-00-00 00:00:00"}:
        if column in NOT_NULL_TIMESTAMPS:
            return "now()"
        return "NULL"

    cleaned = value.strip().replace(" ", "T")
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}", cleaned):
        return sql_literal(cleaned + "+00:00") + "::timestamptz"
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+", cleaned):
        return sql_literal(cleaned + "+00:00") + "::timestamptz"

    warnings.append(f"{table}#{row_id}: timestamp tidak dikenali ({value}) -> now()")
    return "now()"


def to_date(value: str | None) -> str:
    if value is None or value.strip() in {"", "0000-00-00"}:
        return "NULL"
    return sql_literal(value.strip()) + "::date"


def to_integer(value: str | None) -> str:
    if value is None or value.strip() == "":
        return "NULL"
    try:
        return str(int(float(value)))
    except ValueError:
        return "NULL"


def to_numeric(value: str | None) -> str:
    if value is None or value.strip() == "":
        return "NULL"
    try:
        return str(float(value))
    except ValueError:
        return "NULL"


def convert_row(
    table: str,
    row: dict[str, str | None],
    warnings: list[str],
    hosts: set[str],
) -> str:
    row_id = row.get("id") or "?"
    parts: list[str] = []

    for column, raw in row.items():
        if column in {"id", "category_id", "equipment_id", "project_id"}:
            parts.append(to_integer(raw) or "NULL")
        elif column in BOOLEAN_COLUMNS:
            parts.append(to_boolean(raw))
        elif column in JSONB_COLUMNS:
            parts.append(to_jsonb(raw, warnings, table, row_id))
        elif column in TIMESTAMP_COLUMNS:
            parts.append(to_timestamp(raw, column, warnings, table, row_id))
        elif column in DATE_COLUMNS:
            parts.append(to_date(raw))
        elif column == "year":
            parts.append("NULL" if raw in {None, "", "0000"} else to_integer(raw))
        elif column == "price":
            parts.append(to_numeric(raw))
        elif column in {"sort_order", "rating", "total_units"}:
            parts.append(to_integer(raw) or "0")
        elif column == "available_units":
            total = row.get("total_units")
            available = to_integer(raw)
            if available == "NULL":
                available = total or "1"
            if total not in {None, ""} and available != "NULL":
                try:
                    if int(available) > int(float(total)):
                        warnings.append(
                            f"{table}#{row_id}: available_units ({available}) > total_units "
                            f"({total}) -> disesuaikan agar lolos check constraint"
                        )
                        available = str(int(float(total)))
                except ValueError:
                    pass
            parts.append(available)
        elif column in IMAGE_COLUMNS and raw:
            if raw.startswith("http"):
                host = urlparse(raw).netloc
                if host:
                    hosts.add(host)
                parts.append(sql_literal(raw))
            else:
                parts.append(sql_literal(raw))
        else:
            parts.append(sql_literal(raw))

    return f"    ({', '.join(parts)})"


def build_sql(data: "OrderedDict[str, list[dict[str, str | None]]]") -> tuple[str, list[str]]:
    warnings: list[str] = []
    hosts: set[str] = set()
    chunks: list[str] = []

    header = """-- =============================================================================
-- IMPORT DATA KONTEN DARI LARAVEL (MySQL -> Supabase/Postgres)
-- =============================================================================
-- File ini dibuat oleh scripts/import-laravel-data.py.
-- Jalankan SETELAH 0001_init.sql dan 0002_storage.sql.
--
-- Catatan:
--   * id dipertahankan agar relasi antar tabel tetap konsisten.
--   * aman dijalankan ulang karena memakai `on conflict (id) do nothing`.
--   * tabel `users` tidak diimpor; buat admin lewat Supabase Auth.
--   * urutan insert mengikuti dependensi foreign key.
-- =============================================================================

begin;


"""

    chunks.append(header)

    for table in TABLES:
        rows = data.get(table)
        if not rows:
            continue

        rows = sorted(rows, key=lambda item: int(item.get("id") or 0))
        columns = list(rows[0].keys())
        column_list = ", ".join(columns)

        statements = [
            convert_row(table, row, warnings, hosts) for row in rows
        ]

        chunks.append(
            f"\n-- {table} ({len(rows)} baris)\n"
            f"insert into public.{table} ({column_list}) values\n"
            + ",\n".join(statements)
            + "\non conflict (id) do nothing;\n"
        )

    # Lanjutkan identity sequence agar insert berikutnya tidak bentrok.
    resets = ["\n-- Lanjutkan identity sequence (id eksplisit dipakai di atas)."]
    for table in TABLES:
        if not data.get(table):
            continue
        resets.append(
            f"select setval(pg_get_serial_sequence('public.{table}', 'id'), "
            f"coalesce((select max(id) from public.{table}), 1), true);"
        )
    chunks.append("\n".join(resets) + "\n\ncommit;\n")

    return "".join(chunks), warnings + ["", "HOST GAMBAR EKSTERNAL: " + ", ".join(sorted(hosts))]


def build_report(
    data: "OrderedDict[str, list[dict[str, str | None]]]",
    warnings: list[str],
) -> str:
    lines = [
        "# Laporan import data Laravel",
        "",
        "Dihasilkan oleh `scripts/import-laravel-data.py`.",
        "",
        "## Jumlah baris",
        "",
        "| Tabel | Baris |",
        "| --- | --- |",
    ]
    for table in TABLES:
        count = len(data.get(table) or [])
        lines.append(f"| `{table}` | {count} |")

    lines += ["", "## Dilewati", "", "| Tabel | Alasan |", "| --- | --- |"]
    for table in sorted(SKIP_TABLES):
        reason = "autentikasi pindah ke Supabase Auth" if table == "users" else "tabel infrastruktur Laravel"
        lines.append(f"| `{table}` | {reason} |")

    notes = [w for w in warnings if w and not w.startswith("HOST GAMBAR")]
    lines += ["", "## Catatan", ""]
    if notes:
        lines += [f"- {note}" for note in notes]
    else:
        lines.append("- Tidak ada nilai yang perlu diperbaiki otomatis.")

    hosts_line = next((w for w in warnings if w.startswith("HOST GAMBAR")), "")
    if hosts_line:
        hosts = hosts_line.split(": ", 1)[1].split(", ")
        lines += [
            "",
            "## Host gambar eksternal",
            "",
            "Semua nilai gambar berupa URL eksternal. Host ini harus diizinkan oleh",
            "`next/image` lewat `images.remotePatterns` di `next.config.ts`:",
            "",
        ]
        lines += [f"- `{host}`" for host in hosts]

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("dump", type=Path, help="path file dump mysqldump (.sql)")
    args = parser.parse_args()

    if not args.dump.is_file():
        print(f"File tidak ditemukan: {args.dump}", file=sys.stderr)
        return 1

    data = parse_dump(args.dump)
    sql, warnings = build_sql(data)
    report = build_report(data, warnings)

    OUT_SQL.parent.mkdir(parents=True, exist_ok=True)
    OUT_SQL.write_text(sql, encoding="utf-8")
    OUT_REPORT.write_text(report, encoding="utf-8")

    total = sum(len(rows) for rows in data.values())
    print(f"{total} baris -> {OUT_SQL.relative_to(ROOT)}")
    print(f"laporan -> {OUT_REPORT.relative_to(ROOT)}")

    for table in TABLES:
        print(f"  {table:20} {len(data.get(table) or [])}")

    real_warnings = [w for w in warnings if w and not w.startswith("HOST GAMBAR")]
    if real_warnings:
        print("\nperlu perhatian:")
        for warning in real_warnings:
            print(f"  - {warning}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
