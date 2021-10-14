import os
import json
import requests
import sys

def fetch(url):
    res = requests.post(url, json={ "lastRequestDate": "2015-08-29" })
    if (res.status_code == requests.codes.ok):
        return json.loads(res.content) #TODO: parse for only active jobs
    else:
        return
    
    

# run with: python3 import_job_listings.py
if __name__ == '__main__':
    jobs = fetch(url='https://workbcjobs.api.gov.bc.ca/v1/jobs')
    if (jobs != None): # Only write to file if the api call was successful
        dirname = os.path.dirname(__file__)
        path = os.path.join(dirname, '../dao/json/job.json')
        with open(path, 'w') as outfile:
            json.dump(jobs, outfile, indent=4)
