CURRENTDATE=`date +"%Y-%m-%d"`
python covid-19.py
git add .
git commit -m "Update ${CURRENTDATE}"
git push -u origin master