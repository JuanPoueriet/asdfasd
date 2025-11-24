import os
import shutil
import subprocess

webapp_src = "apps/webapp/src/app/features"
libs_root = "libs"
exclude = [
    "accounting", "invoices", "sales", "notifications", "purchasing", "unauthorized", "approvals",
    "data-imports", "reports", "auth", "global-search", "contacts", "settings",
    "inventory", "data-exports", "documents",
    "accounts-payable", "masters"
]

dirs = [d for d in os.listdir(webapp_src) if os.path.isdir(os.path.join(webapp_src, d)) and d not in exclude]
# Take 1
dirs = dirs[:1]

for d in dirs:
    print(f"Processing {d}...")
    lib_path = os.path.join(libs_root, d, "feature-shell")
    import_path = f"@univeex/{d}/feature-shell"

    # Generate lib
    cmd = f"npx nx g @nx/angular:lib --directory={lib_path} --name={d}-feature-shell --importPath={import_path} --interactive=false"
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=False)

    # Move files
    src_dir = os.path.join(webapp_src, d)
    dest_dir = os.path.join(lib_path, "src", "lib")

    # Remove default content
    for item in os.listdir(dest_dir):
        p = os.path.join(dest_dir, item)
        if os.path.isdir(p):
            shutil.rmtree(p)
        else:
            os.remove(p)

    # Move files
    for item in os.listdir(src_dir):
        s = os.path.join(src_dir, item)
        dst = os.path.join(dest_dir, item)
        if os.path.isdir(s):
            shutil.move(s, dst)
        else:
            shutil.move(s, dst)

    # Remove source dir
    shutil.rmtree(src_dir)

    # Update index.ts
    index_ts = os.path.join(lib_path, "src", "index.ts")
    files = os.listdir(dest_dir)
    ts_files = [f for f in files if f.endswith('.ts')]

    with open(index_ts, "w") as f:
        for ts in ts_files:
            f.write(f"export * from './lib/{ts.replace('.ts', '')}';\n")

print("Done moving webapp features 1f_2_a.")
