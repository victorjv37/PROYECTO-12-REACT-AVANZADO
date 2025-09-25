export const FAVORITES_ACTIONS = {
  ADD_FAVORITE: "ADD_FAVORITE",
  REMOVE_FAVORITE: "REMOVE_FAVORITE",
  TOGGLE_FAVORITE: "TOGGLE_FAVORITE",
  CLEAR_FAVORITES: "CLEAR_FAVORITES",
  LOAD_FAVORITES: "LOAD_FAVORITES",
  RATE_EVENT: "RATE_EVENT",
};

export const initialFavoritesState = {
  favorites: [],
  ratings: {},
  loading: false,
  error: null,
};

export const favoritesReducer = (state, action) => {
  switch (action.type) {
    case FAVORITES_ACTIONS.LOAD_FAVORITES:
      return {
        ...state,
        favorites: action.payload.favorites || [],
        ratings: action.payload.ratings || {},
        loading: false,
      };

    case FAVORITES_ACTIONS.ADD_FAVORITE:
      const alreadyExists = state.favorites.some(
        (fav) => fav._id === action.payload._id
      );
      if (alreadyExists) return state;

      return {
        ...state,
        favorites: [...state.favorites, action.payload],
        error: null,
      };

    case FAVORITES_ACTIONS.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav._id !== action.payload),
        ratings: {
          ...state.ratings,
          [action.payload]: undefined,
        },
      };

    case FAVORITES_ACTIONS.TOGGLE_FAVORITE:
      const isFavorite = state.favorites.some(
        (fav) => fav._id === action.payload._id
      );

      if (isFavorite) {
        return {
          ...state,
          favorites: state.favorites.filter(
            (fav) => fav._id !== action.payload._id
          ),
          ratings: {
            ...state.ratings,
            [action.payload._id]: undefined,
          },
        };
      } else {
        return {
          ...state,
          favorites: [...state.favorites, action.payload],
        };
      }

    case FAVORITES_ACTIONS.RATE_EVENT:
      return {
        ...state,
        ratings: {
          ...state.ratings,
          [action.payload.eventoId]: action.payload.rating,
        },
      };

    case FAVORITES_ACTIONS.CLEAR_FAVORITES:
      return {
        ...state,
        favorites: [],
        ratings: {},
      };

    default:
      return state;
  }
};
