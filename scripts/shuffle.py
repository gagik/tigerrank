import hashlib
import random
import json
import requests
from base64 import b64encode
from datetime import datetime

with open('randomData.json') as json_file:  
    data = json.load(json_file)
    random.shuffle(data) 


f = open("randomData_shuffled.json", "w")
f.write(json.dumps(data))
f.close()