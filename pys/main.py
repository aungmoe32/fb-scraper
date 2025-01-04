from facebook_scraper import get_posts

for post in get_posts('nintendo', pages=4):
    print(post)
    print(post['text'][:50])