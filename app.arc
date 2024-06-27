@app
diet-tracker-backend

@http
get /
get /settings/:userId
post /settings/:userId
get /notifications/:userId
post /notifications/:userId
get /query-mfp

@tables
DietTrackerTable # adds Dynamodb table
  PK *String # primary key
  SK **String # sort key

@aws
# profile default
region us-east-1
timeout 30
concurrency 5

@queues
QueryFitnessStats

