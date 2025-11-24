import os
import shutil
import subprocess

api_src = "apps/api/src"
libs_root = "libs"
targets = ["sales", "inventory", "dashboard", "customers", "suppliers"]

for d in targets:
    if not os.path.exists(os.path.join(api_src, d)):
        continue

    print(f"Processing {d}...")
    lib_path = os.path.join(libs_root, d, "feature-api")
    import_path = f"@univeex/{d}/feature-api"

    # Generate lib
    cmd = f"npx nx g @nx/nest:lib --directory={lib_path} --name={d}-feature-api --importPath={import_path} --interactive=false"
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=False)

    # Move files
    src_dir = os.path.join(api_src, d)
    dest_dir = os.path.join(lib_path, "src", "lib")

    # Remove default module created by nx
    default_module = os.path.join(dest_dir, f"{d}-feature-api.module.ts")
    if os.path.exists(default_module):
        os.remove(default_module)

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
    module_name = f"{d}.module"
    with open(index_ts, "w") as f:
        f.write(f"export * from './lib/{module_name}';\n")

print("Done moving batch 1.")
