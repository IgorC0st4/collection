import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editions-list',
  templateUrl: './editions-list.page.html',
  styleUrls: ['./editions-list.page.scss'],
})
export class EditionsListPage implements OnInit {

  databaseObj: SQLiteObject;
  name_model: string = "";
  edition_model: number = 0;
  editions_model: string = "";
  row_data: any = [];
  manga_id = null;
  manga_name: string = "";
  readonly database_name: string = "collection_datatable.db";
  readonly manga_table_name: string = "manga_table";
  readonly edition_table_name: string = "edition_table";

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;

  constructor(private route: ActivatedRoute,
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    })
  }

  ngOnInit(): void {
    this.manga_id = this.route.snapshot.paramMap.get("id");
  }

  // Create DB if not there
  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        console.error("Database created");
        this.createTable();
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Create table
  createTable() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.edition_table_name} (pid INTEGER PRIMARY KEY, Name varchar(255), Number INTEGER, id_manga INTEGER, FOREIGN KEY(id_manga) REFERENCES ${this.manga_table_name} (pid))
    `,
      [])
      .then(() => {
        this.getMangaNameById();

        this.getRows();
        console.error("Edition Table created");
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Verify if user wants to insert one or n editions
  async save() {
    // Value should not be empty
    if (!this.editions_model) {
      alert("Enter Edition");
      return;
    }

    if (!this.manga_name) {
      await this.getMangaNameById();
    }
    
    var editionsSplit = this.editions_model.split("-");
    console.error(editionsSplit.toString());

    if(editionsSplit.length == 1){
      this.edition_model = parseInt(editionsSplit[0]);
      console.error("insertRow() called");
      this.insertRow();
    }else{
      console.error("insertRows() called");
      this.insertRows(parseInt(editionsSplit[0]), parseInt(editionsSplit[1]));
    }

  }

  // Insert row in the table
  insertRow() {
    this.name_model = this.manga_name + " " + this.edition_model;
    this.databaseObj.executeSql(`
      INSERT INTO ${this.edition_table_name} (Name, Number, id_manga) VALUES ('${this.name_model}', ${this.edition_model} , ${this.manga_id})
      `, [])
      .then(() => {
        console.error('Row Inserted');
        this.getRows();
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });

  }

  // Insert rows in the table
  async insertRows(initialEdition:number, finalEdition:number) {
    for(var i = initialEdition; i<=finalEdition; i++){
      this.edition_model = i;
      await this.insertRow();
    }
  }


  getMangaNameById() {
    this.databaseObj.executeSql(`
      SELECT * FROM ${this.manga_table_name} WHERE pid = ${this.manga_id}
    `, [])
      .then((res) => {
        if (res.rows.length > 0) {
          this.manga_name = res.rows.item(0).Name;
        }
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Retrieve rows from table
  getRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.edition_table_name} WHERE id_manga = ${this.manga_id} ORDER BY Number DESC
    `, [])
      .then((res) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Delete single row 
  deleteRow(item) {
    this.databaseObj.executeSql(`
      DELETE FROM ${this.edition_table_name} WHERE pid = ${item.pid}
    `, [])
      .then((res) => {
        console.error("Row Deleted!");
        this.getRows();
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Enable update mode and keep row data in a variable
  enableUpdate(item) {
    this.updateActive = true;
    this.to_update_item = item;
    this.name_model = item.Name;
  }

  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
      UPDATE ${this.edition_table_name}
      SET Name = '${this.name_model}'
      WHERE pid = ${this.to_update_item.pid}
    `, [])
      .then(() => {
        console.error('Row Updated!');
        this.updateActive = false;
        this.getRows();
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

}
