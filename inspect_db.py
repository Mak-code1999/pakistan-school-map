
# 2.2 Re-running inspectdb to capture full output for analysis
import subprocess

try:
    result = subprocess.run(
        [r"backend\venv\Scripts\python", r"backend\manage.py", "inspectdb"],
        capture_output=True,
        text=True,
        check=True
    )
    print(result.stdout)
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
    print(e.stderr)
