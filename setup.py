#!/usr/bin/python
import argparse
import os

parser = argparse.ArgumentParser(description='Initialize the NodeJS server for PictureMyWorld')
parser.add_argument('-e','--env', help='Configure the deployment environment.', required=True, default=None)
parser.add_argument('-i','--install', help='Install all node dependencies.', default=False, action='store_true')
parser.add_argument('-d','--delete', help='Delete the database for the given deployment environment.', default=False, action='store_true')
parser.add_argument('-c','--create', help='Create a new database for the given deployment environment.', default=False, action='store_true')
parser.add_argument('-r','--run', help='Run the server.', default=False, action='store_true')
parser.add_argument('-t','--test', help='Run the Unit-Tests.', default=False, action='store_true')

args = parser.parse_args()
setenv = "export NODE_ENV=" + args.env + " ; "

# First install the dependencies.
if args.install:
	os.system(setenv + "npm install")
	
# Then delete and/or create the database.
if args.delete:
	os.system(setenv + "npm run deleteDB")
	os.system(setenv + "rm -rf user_uploads")

if args.create:
	os.system(setenv + "npm run createDB")

# Finally run the unit tests or the server itself.
if args.run:
	os.system(setenv + "npm start")
elif args.test:
	os.system(setenv + "npm test")
