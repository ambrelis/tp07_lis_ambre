export class AddFavorite {
  static readonly type = '[Favorites] Add';
  constructor(public pollutionId: string) {}
}

export class RemoveFavorite {
  static readonly type = '[Favorites] Remove';
  constructor(public pollutionId: string) {}
}

export class ClearFavorites {
  static readonly type = '[Favorites] Clear';
}
