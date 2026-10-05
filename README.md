## CALPHY_FINALS

# Git push instructions and steps:

--- DO NOT PUSH TO MAIN DIRECTLY, CREATE A BRANCH ---
--- IF YOU ONLY MODIFIED A SINGLE FILE, PLEASE, ONLY ADD THAT SPECIFIC FILE WHEN PUSHING ---
                  
- Branch Name Structure: [Username]-[Date][Month/Day/Year]-[Version]
                     || Ex. SetsuDesu17-10/5/2026-v1
  
Git push steps:
- git pull (When accessing a new branch, else skip)
- git checkout -b [branchName (follow the branchName Structure]
- git add [folder_directory] || [.](STRICTLY ONLY WHEN MODIFYING MULTIPLE FOLDERS) 
- git commit -m "[Your commit mesg]"

--- IF FIRST TIME PUSH IN BRANCH
- git push -u origin [branchName]

--- IF PUSHED AN UPDATE IN THE SAME DAY
- git push

# Node Modules (For running backend)
In Projects/CALPHY_FINALS
- npm init -y
- npm install express mysql2 cors
