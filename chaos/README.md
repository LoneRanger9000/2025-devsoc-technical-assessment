> This question is relevant for **chaos backend**

# DevSoc Subcommittee Recruitment: Chaos Backend

***Complete as many questions as you can.***

## Question 1
You have been given a skeleton function `process_data` in the `data.rs` file.
Complete the parameters and body of the function so that given a JSON request of the form

```json
{
  "data": ["Hello", 1, 5, "World", "!"]
}
```

the handler returns the following JSON:
```json
{
  "string_len": 11,
  "int_sum": 6
}
```

Edit the `DataResponse` and `DataRequest` structs as you need.

## Question 2

### a)
Write (Postgres) SQL `CREATE TABLE` statements to create the following schema.
Make sure to include foreign keys for the relationships that will `CASCADE` upon deletion.
![Database Schema](db_schema.png)

**Answer box:**
```sql

CREATE TYPE question_type as enum ('MultiSelect', 'ShortAnswer')

CREATE TABLE forms (
  id            integer primary key,
  title         text,
  description   text
);

CREATE TABLE questions (
  id            integer primary key,
  form_id       integer references forms(id) on delete cascade,
  title         text,
  question_type question_type,
);

CREATE TABLE question_options (
  id          integer primary key,
  question_id integer references questions(id on delete cascade,
  option       text
);
```

### b)
Using the above schema, write a (Postgres) SQL `SELECT` query to return all questions in the following format, given the form id `26583`:
```
   id    |   form_id   |           title             |   question_type   |     options
------------------------------------------------------------------------------------------------------------
 2       | 26583       | What is your full name?     | ShortAnswer       | [null]
 3       | 26583       | What languages do you know? | MultiSelect       | {"Rust", "JavaScript", "Python"}
 7       | 26583       | What year are you in?       | MultiChoice       | {"1", "2", "3", "4", "5+"}
```

**Answer box:**
```sql
select q.id as id, q.form_id as form_id, q.title as title, q.question_type as question_type, qo.option as options
from questions q, question_options qo
join q.id = qo.question_id
where q.form_id = 26583
```