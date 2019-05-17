import {Injectable} from '@angular/core';
import {GenreModel} from '../../models/genre.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {UsersService} from '../../users/users.service';
import {RequeteUtils} from '../../shared/utils/requete.utils';

@Injectable({
    providedIn: 'root'
})
export class GenreService {

    private listeGenre: GenreModel[];

    listeGenre$: BehaviorSubject<GenreModel[]> = new BehaviorSubject(this.listeGenre);

    constructor(private http: HttpClient, private userService: UsersService, private requeteUtils: RequeteUtils) {
    }

    private getGenres(): Observable<GenreModel[]> {
        return this.http.get<GenreModel[]>(this.requeteUtils.url + 'genres?idUser=' + this.userService.idUser,
            this.requeteUtils.getOptions());
    }

    publishGenres() {
        this.getGenres().subscribe(
            genres => {
                this.listeGenre = genres;
                this.listeGenre$.next(this.listeGenre);
            }
        );
    }

    getGenre(designation: string): Observable<GenreModel> {
        return this.http.get<GenreModel>(this.requeteUtils.url + 'genres/' + designation + '?idUser=' + this.userService.idUser, this.requeteUtils.getOptions());
    }

    saveGenre(genre: GenreModel) {
        this.http.post<GenreModel>(this.requeteUtils.url + 'genres/save', genre, this.requeteUtils.getOptions()).subscribe(
            genre => {
                this.listeGenre.push(genre);
                this.listeGenre$.next(this.listeGenre);
            }
        );
    }

    deleteGenre(id: number) {
        const url = this.requeteUtils.url + 'genres/delete?id=' + id;
        this.http.delete(url, this.requeteUtils.getOptions()).subscribe(
            () => {
                const index = this.listeGenre.findIndex(genres => {
                    if (genres.idGenre === id) {
                        return true;
                    }
                });
                this.listeGenre.splice(index, 1);
                this.listeGenre$.next(this.listeGenre);
            }
        );
    }
}
