import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

driver = webdriver.Chrome('./chromedriver_win32/chromedriver.exe')
timeout = 5

searchQuery = "bitcoin"
outputFile = "news_data.txt"

currentUrl = "https://www.google.ca/search?q=" + searchQuery + "&tbm=nws&ei=Vm4QWrqZJcKJ0wLS64LoAw&start=0&sa=N&biw=1280&bih=654&dpr=2.5";
f1=open(outputFile, 'w+')

count = 0;

while (count < 20):
	page = requests.get(currentUrl)
	soup = BeautifulSoup(page.content, 'html.parser')

	for article in soup.find_all("b"):
		if article.parent.name == 'a':
			print >> f1, article.parent.getText().encode('utf-8');

	driver.get(currentUrl)#put here the adress of your page
	elem = driver.find_element_by_id('pnnext')
	# print(elem .get_attribute("class"))
	elem.click();

	try:
	    element_present = EC.presence_of_element_located((By.ID, 'pnnext'))
	    WebDriverWait(driver, timeout).until(element_present)
	except TimeoutException:
	    print "Timed out waiting for page to load"

	currentUrl = driver.current_url

	count = count + 1;

driver.close()