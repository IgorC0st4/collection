import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  databaseObj: SQLiteObject;
  row_data: any = [];
  readonly database_name: string = "collection_datatable.db";
  readonly edition_table_name: string = "edition_table";

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
    SELECT * FROM ${this.edition_table_name} ORDER BY pid DESC LIMIT 10
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
        console.error(error);
        alert("error " + JSON.stringify(error));
      });
  }
}
