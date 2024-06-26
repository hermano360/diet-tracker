@app
diet-tracker-backend

@http
get /
get /settings/:userId
post /settings/:userId
put /settings/:userId

@tables
DietTrackerTable # adds Dynamodb table
  PK *String # primary key
  SK **String # sort key

@aws
# profile default
region us-east-1
