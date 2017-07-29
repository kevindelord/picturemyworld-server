#!/usr/bin/python
import argparse
import os

parser = argparse.ArgumentParser(description='Initialize the NodeJS server for PictureMyWorld')
parser.add_argument('-e','--env', help='Configure the deployment environment.', required=True, default=None)
parser.add_argument('-i','--install', help='Install all node dependencies.', default=False, action='store_true')
parser.add_argument('-d','--delete', help='Delete the database for the given deployment environment.', default=False, action='store_true')
parser.add_argument('-c','--create', help='Create a new database for the given deployment environment.', default=False, action='store_true')
parser.add_argument('-r','--run', help='Run the server.', default=False, action='store_true')

args = parser.parse_args()

def installDependencies():
	if args.install:
		os.system("npm install")
	
def configureDatabase():
	if args.delete:
		os.system("npm run deleteDB")

	if args.create:
		os.system("npm run createDB")

def configureDeployEnv():
	env = args.env
	os.system("export NODE_ENV=" + env)

def run():
	if 	args.run:
		os.system("npm start")


configureDeployEnv()
installDependencies()
configureDatabase()
run()
