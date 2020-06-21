CURRENTDATE=`date +"%Y-%m-%d"`
git config user.name 'CD Pipeline'
git config user.email 'cd@trashmail.com'
git add .
git commit -m "Update ${CURRENTDATE}"
git push -u origin master
