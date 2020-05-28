import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';

// General
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';

// Usuarios
import { UserEditComponent } from './components/user-edit.component';

// Artistas
import { ArtistListComponent } from './components/artis-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

// Albums
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

// Canciones
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

// Player
import { PlayerComponent } from './components/player.component';

@NgModule({
  declarations: [         
    AppComponent,
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent
  ],
  imports: [               
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],            
  bootstrap: [AppComponent]  
})

export class AppModule { }
