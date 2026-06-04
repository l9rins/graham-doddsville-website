import subprocess
import re

def main():
    print("Getting all commits...")
    commits = subprocess.check_output(['git', 'rev-list', '--all']).decode('utf-8').splitlines()
    print(f"Found {len(commits)} commits. Searching for missing articles...")
    
    missing_ids = ['self-managed-super-fund-smsf', 'introduction-to-cgt', 'the-calculation-of-cgt']
    
    found_in_commits = []
    
    for commit in commits:
        try:
            # Check legal-taxation.html in this commit
            content = subprocess.check_output(['git', 'show', f'{commit}:legal-taxation.html'], stderr=subprocess.DEVNULL).decode('utf-8')
            for mid in missing_ids:
                if f"'{mid}':" in content:
                    found_in_commits.append((commit, mid))
                    print(f"FOUND {mid} in commit {commit}")
        except subprocess.CalledProcessError:
            pass # File didn't exist in this commit
            
    if not found_in_commits:
        print("None of the missing IDs were found in any past version of legal-taxation.html.")
    else:
        print("Done searching.")

if __name__ == '__main__':
    main()
