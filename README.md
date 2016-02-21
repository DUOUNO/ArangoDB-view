# ArangoDB-view
`dentist removed much candy`

ArangoDB-view is a poc webinterface for [ArangoDB](http://github.com/arangodb/arangodb). Its based on a flex design.

#### features
* actually displays right converted bytes (1000B = 1KB)
* always to your left, collections overview (can be hidden)
* always to your top, basic infos / stats
* show all available updates
* open links in a new tab
* easily create rules that filter and sort documents
* pagination is saved when you edit a document and return to documents overview
* next / prev document while in single document view
* management collections / edges
  * navigate to documents
  * load / unload

#### whats next?
* manage(CRUD) collections / edges
* link _from / _to
* delete documents
* run AQL queries
* query log
* authentication

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

![interfacescreenshot](images/version1.png)
show available version for update


### install
#### mount point
for now the mount point must be `/view`.

#### filter/sort documents
##### create a new filter/sort rule
First select the none rule and change `// none` to your rule name.
You may have to klick on the direct left button from the rule selection to reveal the rule input field.
Now you can edit your rule as native AQL statements. The current document can be accessed via `doc`. Let's create a rule that filters all _key smaller than 10.
```
01: // filter ._key < 10
02: filter to_number(doc._key) < 10
```
Line 1 is the name of the rule
Line 2 is the AQL statement that will filter all _keys samller 10. Note the conversion to a number first.
After a short timeout your new rule is automatically saved and applied to the documents overview. When you click outside from the input field the edited rule is also saved and applied.

##### edit filter/sort rule
To edit a rule just type the new rule into the rule input field. The rule is automatically save and applied when you click outside.

##### create new rule from existing rule
First change the rule name, then edit the rule. The new rule is saved automatically.
