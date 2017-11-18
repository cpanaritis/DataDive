import requests
from bs4 import BeautifulSoup

page = requests.get("https://www.google.ca/search?q=bitcoin&tbm=nws&ei=Vm4QWrqZJcKJ0wLS64LoAw&start=0&sa=N&biw=1280&bih=654&dpr=2.5")
soup = BeautifulSoup(page.content, 'html.parser')

f1=open('./testfile.txt', 'w+')

for article in soup.find_all("b"):
	if article.parent.name == 'a':
		print >> f1, article.parent.getText().encode('utf-8');