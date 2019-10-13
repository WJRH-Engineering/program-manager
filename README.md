# program-manager
New Teal - codename: (N)eal. 
Currently a thin wrapper for teal that adds a couple new features

## Using (N)eal
For development purposes, (N)eal is being hosted temporarily at http://45.55.38.183:4000/graphql

Navigating there in your browser will allow you to use the GraphiQL GUI to query the teal database, or alternatively,
you can send an http post request to the same address

### Example Queries

Get the name and author of the first 20 programs
```graphql
# Get the name and author of the first 20 programs
query{
  programs(limit_to: 20){
    name,
    author
  }
}
```
Get the audio url and publishing date of every episode belonging to the program "vbb"
```graphql
query{
  program(shortname: "vbb"){
    episodes{
      audio_url,
      pubdate
    }
  }
}
```
Get the artist and title of every song played on every episode of the first 10 programs
that match the seach parameter "hip hop"
```graphql
query{
  programs(search_param: "hip hop", limit_to: 10, deep: true){
    episodes{
      tracks{
        artist,
        title
      }
    }
  }
}
```
