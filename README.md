# command-line-portfolio-mgr

Let us assume you are a crypto investor. You have made transactions over a period of time which is logged in a [CSV file](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip). Write a command line program that does the following

- Given no parameters, return the latest portfolio value per token in USD
- Given a token, return the latest portfolio value for that token in USD
- Given a date, return the portfolio value per token in USD on that date
- Given a date and a token, return the portfolio value of that token in USD on that date

The CSV file has the following columns

- timestamp: Integer number of seconds since the Epoch
- transaction_type: Either a DEPOSIT or a WITHDRAWAL
- token: The token symbol
- amount: The amount transacted

Portfolio means the balance of the token where you need to add deposits and subtract withdrawals. You may obtain the exchange rates from [cryptocompare](https://min-api.cryptocompare.com/) where the API is free. You should write it in Node.js as our main stack is in Javascript/Typescript and we need to assess your proficiency.

#### ---Samlple Solution---
## How to run with test data 
Run one of the following commands:
> tsc & node dist/index.js --t=ETH --d=1571966641

> tsc & node dist/index.js --t=ETH

> tsc & node dist/index.js --d=1571966641

> tsc & node dist/index.js

### Performance
Version 0.1.4 takes ~75 seconds to run on a set of 33 M rows in the CSV file, on a 'standard' laptop.

### some thoughts during the initial phase of the development:

- The original file is too large to be included in the repo. Too big probably to handle in memory - 30M records? Does working with a sample of the data make sense?
- We have no guarantee that the data is sorted by timestamp or at all, so we might need to sort it first.
- We have no guarantee there are only 3 tokens, so we might think on a solution able to handle any number of tokens.
- should we bind to the specific CSV columns? might be safe to do so at this stage, but we might want to make it more flexible later on.
- should we cache results? for how long?
- should we think in a direction to make it more performant? (e.g. using a database). In order to provide whatever result we need to go through the entire set of transactions and calculate the balance for each token. How about go through it once and store every transaction in a row in a database? Then we can query the database for the balance of a token at a given date and leave the DB to do the calculation.
- We can also pre-calculate and store the balance of each token at a given date in a separate table, so we can query it directly. This way we can avoid going through the entire set of transactions every time we need to calculate the balance of a token at a given date. however a user might never checks a balance hence it might be a waste of resources.
- there are no requirements for performance, so we can just go with the simplest solution and iterate on it later on.
- should we check first line of the csv file if it's a header and parse it properly
- if we use RDBMS with a limited number of tokens(like for ex just the 3) we might use a table like so:
  | date | BTCCredit | BTCDebit | token2Credit | token2Debit | ...
  then index the table by date and when we have a query for a token at a given date we can just query the table by date and then calculate sums of XCredit and XDebit.
- if we are to support any number of tokens in RDBMS, we might need to use a different approach. we can use a table like so:
  | date | token | credit | debit |
  ex. | 2018-01-01 | BTC | 0.55224| null |
  then index the table by date.
- if we use RDBMS, we might try to use an in memory one.
- parsing of the args might be done with a library like [yargs](https://www.npmjs.com/package/yargs) , which is referred in nodeJS docs.
- it is key to understand how often and for what values the queries will be most often. Not a fan of storing data that can be calculated on the fly, but if we receive a lot of queries for the same values, it might be worth it. Should we use some analytics to get more info on this?
- In a future iteration might split the big file into smaller ones and store them in databases or csv files. Then we can query just one file for ex for the latest month, where most reports are presumably taken from. Oldest data, like years ago might be in a separate files. However there is an effort to create and maintain such architecture and we need more info on the requirements/usability
- should we plan for a fallback of the API we get the prices from? if we see a lot of requests, should we cache? if we get just some of the prices, should we return the ones we have and the ones we don't? should we return an error?
- should we normalize all the data in the CSV before we start using it? is the csv date coming from a system we can consume or should we do some (security) checks?
- should we go through the CSV file first and get the various tokens and oldest and latest dates.
- if we get a request for a date that is not present presumably we should try to process the date up until this point in time. this will be a lot faster if the data is sorted. But this might not worth it - we need to agree on requirements and deliverables.
- do we have some restrictions on libraries we can use? should we bind to specific versions?
- in memory solutions might not be suitable for production
- what is the scale of users this solution will be offered to
- should we use big data DB like Hadoop or Cassandra if the number of tokens is large and the number of transactions is large.
- if we use RDbMS, should we use ORM, or just use the DB directly
- once we have some analytics, should we allow for hybrid ways of querying data, like in-memory json-like searches for the latest data, and RDBMS for older data.
- cryptocompare.com API is free, but it has a limit. Should we establish a process for tracking the limit and alerting if we are close to it?

### updates

- version: 0.1.1 - we can now query for a token at a given date (provided in since Epoch format)
  Note: the query takes 30-45 seconds to complete for the test set of 30M records in the csv file
- version: 0.1.2 - we now support query by token only
- version: 0.1.3 - we now support query by date only
- version: 0.1.4 - we now support query with no args provided