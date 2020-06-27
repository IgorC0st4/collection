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
  editions_row_data: any = [];
  readonly database_name: string = "collection_datatable.db";
  readonly manga_table_name: string = "manga_table";
  readonly edition_table_name: string = "edition_table";

  // Variables to i/o interactions
  private mangaStr: string;
  progress:number = 0;
  stringToWrite: string = "";
  editionsStr: string = "";

  constructor(
    private platform: Platform,
    private sqlite: SQLite) {
    this.platform.ready().then(() => {
      this.createDB();
    }).catch(error => {
      console.log(error);
    })
  }

  // Export the collection to a string that will be presented in the textarea
  async exportCollection() {
    console.error("exportCollection called");
    try {
      this.stringToWrite = "";

      // Get List of mangas
      await this.getAllMangas();

      // Populate string to be writen
      for (var i = 0; i < this.mangas_row_data.length; i++) {
        // Add name to str
        this.mangaStr = this.mangas_row_data[i].Name;

        // Format to editions
        this.mangaStr += " vols ";

        // Adds editions to the string
        await this.editionsToStr(this.mangas_row_data[i].pid).then(() => {
          // Concat this manga and editions to final string
          this.mangaStr += this.editionsStr;
          this.stringToWrite += this.mangaStr;
        });
        this.progress = i/this.mangas_row_data.length;
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Get mangas in the collection
  async getAllMangas() {
    console.error("getAllMangas called");
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

  // Retrieve editions from a manga
  async getEditionsFromManga(manga_id: number) {
    console.error("getEditionsFromManga " + manga_id.toString() + " called");
    await this.databaseObj.executeSql(`
    SELECT * FROM ${this.edition_table_name} WHERE id_manga = ${manga_id} ORDER BY Number
    `, [])
      .then((res) => {
        this.editions_row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            this.editions_row_data.push(res.rows.item(i));
          }
        }
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }


  async editionsToStr(manga_id: number) {
    console.error("editionsToStr called");
    this.editionsStr = "";

    // Get the editions from the manga
    await this.getEditionsFromManga(manga_id).then(() => {
      for (var j = 0; j < this.editions_row_data.length; j++) {
        // Add a volume number to the string
        this.editionsStr += this.editions_row_data[j].Number.toString();

        // Compares if it's the end of the interation
        if (j != this.editions_row_data.length - 1) {
          this.editionsStr += " , ";
        }
      }
      this.editionsStr += ". \n";
      console.error("manga_id" + manga_id.toString() + " : " + this.editionsStr);
    });
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
      })
      .catch(error => {
        alert("error " + JSON.stringify(error));
        console.error(error);
      });
  }
}
