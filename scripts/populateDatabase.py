#!/usr/bin/python

import requests

def createUser():
	r = requests.post('http://localhost:3000/users', data = {
		'email': 'test@mail.com',
		'username': 'alex',
		'password': 'superpass'
	})
	print r.content

def createNewPosts(cookies):
	r = requests.post('http://localhost:3000/post', cookies = cookies, data = {
		'title': 'Lovely Title',
		'description': 'That was good',
		'location': 'London Bridge',
		'lat': 0.34567,
		'lng': -64.4356,
		'date': '2017-01-08',
		'ratio': 0.75
	})
	print r.content
	
	r = requests.post('http://localhost:3000/post', cookies = cookies, data = {
		'title': 'Secondary Post',
		'description': 'May the force be with you',
		'location': 'Colombia',
		'lat': 4.34567,
		'lng': -4.4356,
		'date': '2017-01-10',
		'ratio': 1.33
	})
	print r.content

def login():
	r = requests.post('http://localhost:3000/login', data = {
		'username': 'test@mail.com',
		'password': 'superpass'
	})
	print r.content
	return r.cookies

def getPosts(cookies):
	r = requests.get('http://localhost:3000/posts', cookies = cookies)
	print r.content

def getAllUsers(cookies):
	r = requests.get('http://localhost:3000/users', cookies = cookies)
	print r.content

def logout():
	r = requests.get('http://localhost:3000/logout')
	print r.content

createUser()
cookies = login()
createNewPosts(cookies)
getPosts(cookies)
getAllUsers(cookies)
logout()