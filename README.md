# ArangoDB-view
`dentist removed much candy`

ArangoDB-view is a poc webinterface for [ArangoDB](http://github.com/arangodb/arangodb). Its based on a flex design.

#### features
* actually displays right converted bytes (1000B = 1KB)
* always to your left, collections overview (can be hidden)
* always to your top, basic infos / stats
* easily create presets that filter and sort documents
* pagination is saved when you edit a document and return to documents overview
* next / prev document while in single document view

#### whats next?
* delete documents

* manage(CRUD) collections / edges

![interfacescreenshot](images/screen0.png)
documents overview

![interfacescreenshot](images/screen4.png)
documents overview with hidden collectionsbar

![interfacescreenshot](images/filter1.png)
sort documents desc

![interfacescreenshot](images/filter2.png)
show documents with _key < 110 and sort documents asc

![interfacescreenshot](images/screen1.png)
editing json in object mode

![interfacescreenshot](images/screen2.png)
editing json in code mode

![interfacescreenshot](images/screen3.png)
disabled save / view change due to error 
