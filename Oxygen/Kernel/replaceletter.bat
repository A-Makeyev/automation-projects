@echo off
setlocal enabledelayedexpansion

REM Set the directory containing the files
set "directory=C:\Users\snladmin\Desktop\karnel\Settings\AllocatedDualService"

REM Set the letter you want to replace and the replacement letter
set "letter_to_replace=Data for AllocatedDualService"
set "replacement_letter=Data for AllocatedDualService"

REM Loop through the files in the directory
for %%F in ("%directory%\*") do (
    set "filename=%%~nF"
    set "new_filename=!filename:%letter_to_replace%=%replacement_letter%!"
    
    REM Rename the file
    ren "%%F" "!new_filename!%%~xF"
    echo Renamed "%%F" to "!new_filename!%%~xF"
)

echo File renaming completed.
pause
