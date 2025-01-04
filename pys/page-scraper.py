#import Facebook_scraper class from facebook_page_scraper
from facebook_page_scraper import Facebook_scraper

#instantiate the Facebook_scraper class

page_or_group_name = "myanmar.youtuber"
posts_count = 10
browser = "firefox"
proxy = "IP:PORT" #if proxy requires authentication then user:password@IP:PORT
timeout = 600 #600 seconds
headless = True
# get env password
# fb_password = os.getenv('fb_password')
# fb_email = os.getenv('fb_email')
# indicates if the Facebook target is a FB group or FB page
isGroup= False
meta_ai = Facebook_scraper(page_or_group_name, posts_count, timeout=timeout, headless=headless, isGroup=isGroup)
#call the scrap_to_json() method

json_data = meta_ai.scrap_to_json()
print(json_data)
