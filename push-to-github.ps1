# Push to GitHub
cd "c:\Users\risha\Downloads\woxsenvp-website"
git push origin main --force --quiet
Write-Host "Push complete!"
if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to GitHub!"
} else {
    Write-Host "Push failed with code $LASTEXITCODE"
}
