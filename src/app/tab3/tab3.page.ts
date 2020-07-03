import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  // Variables to Database management
  databaseObj: SQLiteObject;
  mangas_row_data: any = [];
  signature_row_data: any = [];
  description_model: string = "";
  manga_id: number = 0;
  selected_manga:string = "";
  readonly database_name: string = "collection_datatable.db";
  readonly manga_table_name: string = "manga_table";
  readonly signature_table_name: string = "signature_table";

  constructor(
    private platform: Platform,
    private sqlite: SQLite) {
    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    })
  }

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;

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
        this.getAllMangas();
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Create table
  createTable() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.signature_table_name} (pid INTEGER PRIMARY KEY, Description varchar(255), id_manga INTEGER, FOREIGN KEY(id_manga) REFERENCES ${this.manga_table_name} (pid))
    `,
      [])
      .then(() => {
        this.getAllSignatures();
        console.error("Signature Table created");
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Retrieve rows from table
  getAllSignatures() {
    this.databaseObj.executeSql(`
    SELECT ${this.signature_table_name}.*, ${this.manga_table_name}.Name
    FROM ${this.signature_table_name}
    INNER JOIN ${this.manga_table_name} ON ${this.signature_table_name}.id_manga = ${this.manga_table_name}.pid
    ORDER BY ${this.manga_table_name}.Name;
    `, [])
      .then((res) => {
        this.signature_row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.signature_row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Retrieve rows from table
  getAllMangas() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.manga_table_name} ORDER BY Name
    `, [])
      .then((res) => {
        this.mangas_row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.mangas_row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  save(){
    console.error(this.selected_manga.toString());
    console.error(this.description_model);
    for(var i = 0; i<this.mangas_row_data.length; i++){
      if(this.selected_manga === this.mangas_row_data[i].Name){
        console.error("position " + i);
        this.manga_id = this.mangas_row_data[i].pid;
        console.error(this.manga_id.toString());
        this.insertRow();
      }
    }
  }

  // Insert row in the table
  insertRow() {
    // Value should not be empty
    if (!this.description_model.length) {
      alert("Enter Description");
      return;
    }

    this.databaseObj.executeSql(`
    INSERT INTO ${this.signature_table_name} (Description, id_manga) VALUES ('${this.description_model}', ${this.manga_id})
    `, [])
      .then(() => {
        console.error('Row Inserted');
        this.getAllSignatures();
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

  // Delete single row 
  deleteRow(item) {
    this.databaseObj.executeSql(`
      DELETE FROM ${this.signature_table_name} WHERE pid = ${item.pid}
    `, [])
      .then((res) => {
        console.error("Row Deleted!");
        this.getAllSignatures();
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
    this.description_model = item.Description;
    this.selected_manga = item.Name;
  }

  // Update row with saved row id
  updateRow() {
    this.databaseObj.executeSql(`
      UPDATE ${this.signature_table_name}
      SET Description = '${this.description_model}'
      WHERE pid = ${this.to_update_item.pid}
    `, [])
      .then(() => {
        console.error('Row Updated!');
        this.updateActive = false;
        this.getAllSignatures();
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }

}
