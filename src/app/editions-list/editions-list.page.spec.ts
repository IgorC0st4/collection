import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditionsListPage } from './editions-list.page';

describe('EditionsListPage', () => {
  let component: EditionsListPage;
  let fixture: ComponentFixture<EditionsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditionsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
