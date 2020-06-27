import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  databaseObj: SQLiteObject;
  name_model: string = "";
  row_data: any = [];
  readonly database_name: string = "collection_datatable.db";
  readonly manga_table_name: string = "manga_table";

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    })
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
    CREATE TABLE IF NOT EXISTS ${this.manga_table_name} (pid INTEGER PRIMARY KEY, Name varchar(255))
    `,
      [])
      .then(() => {
        this.getRows();
        console.error("Manga Table created");
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Insert row in the table
  insertRow() {
    // Value should not be empty
    if (!this.name_model.length) {
      alert("Enter Name");
      return;
    }

    this.databaseObj.executeSql(`
    INSERT INTO ${this.manga_table_name} (Name) VALUES ('${this.name_model}')
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

  // Retrieve rows from table
  getRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.manga_table_name} ORDER BY Name
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
      DELETE FROM ${this.manga_table_name} WHERE pid = ${item.pid}
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
      UPDATE ${this.manga_table_name}
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