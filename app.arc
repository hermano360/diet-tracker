@app
diet-tracker-backend

@http
get /
get /settings/:userId
post /settings/:userId
get /notifications/:userId
post /notifications/:userId
get /trigger-fetch
get /users
post /users/:userId

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
query-user-data

@scheduled
FitnessUpdater rate(1 minute)
diet-tracker cron(29 * * * ? *) 

