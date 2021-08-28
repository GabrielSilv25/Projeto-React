import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';

import { setRestaurants, setRestaurant } from '../../redux/modules/restaurants';

export const MapContainer = (props) => {
  const dispatch = useDispatch();
  const [map, setMap] = useState(null);
  const { restaurants } = useSelector((state) => state.restaurants);
  const { google, query, placeId } = props;

  const searchByQuery = useCallback(
    //query => busca de usuárion 
    (map, query) => {
      const service = new google.maps.places.PlacesService(map);
      dispatch(setRestaurants([]));

      const request = {
        location: map.center,
        radius: '200',
        type: ['restaurant'],
        query,
      };

      service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          dispatch(setRestaurants(results));
        }

        // o text é porquê o usuário fará uma busca de texto
      });
    }, 
    [dispatch, google]
  );

  const getDetails = useCallback(
    (placeId) => {
      const service = new google.maps.places.PlacesService(map);
      dispatch(setRestaurant(null));

      const request = {
        placeId,
        fields: ['name', 'opening_hours', 'formatted_address', 'formatted_phone_number'], //volta os detalhes que queremos citados no array
      };

      service.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          dispatch(setRestaurant(place));
        }
      });
    },
    [google, map, dispatch]
  );

  useEffect(() => {
    if (query) {
      searchByQuery(map, query);
    }
  }, [searchByQuery, query, map]);

  useEffect(() => {
    if (placeId) {
      getDetails(placeId);
    }
  }, [placeId, getDetails]);//um event mostrará os detalhes do restaurant.

  const searchNearby = (map, center) => {
    const service = new google.maps.places.PlacesService(map);
    dispatch(setRestaurants([]))

    const request = {
      location: center,
      radius: '20000',
      type: ['restaurant'],//oq a aplicação acha o tipo de lugar fisico
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        dispatch(setRestaurants(results));
      }
    });
  };

  function onMapReady(_, map) { 
    /*
    com isso você poderá pesquisar oq se quer comer
    */
    setMap(map);
    searchNearby(map, map.center);
  }

  return (
    <Map
      google={google}
      centerAroundCurrentLocation 
      /*
        ^ é uma propriedade bolleana, que quando se tem
      essa propriedade, ele faz o uso da API-Navegator
      do navegador, para pegar a localização atual do 
      usuário.
        Caso não tiver, será iniciado na lat. e long. 
      padrão do mapa.
      */
      onReady={onMapReady}
      onRecenter={onMapReady} 
      /*^ isso faz recentralizar, isto é, quando 
      usuário faz algo que impede que veja a localização
      atual do mesmo, assim, será usado a lat. e long. padrão.
      */
      zoom={15}
      {...props}>
      {restaurants.map((restaurant) => (
        <Marker
          //é o que fará mostrar no mapa
          key={restaurant.place_id}
          name={restaurant.name}
          position={{
            lat: restaurant.geometry.location.lat(),
            lng: restaurant.geometry.location.lng(),
          }}
        />
      ))}
    </Map>
  );
};

export default GoogleApiWrapper({ 
  /*
  Objeto muito importante, pois através dele que
  você poderá utilizar o maps e achar os restaurantes,
  a chave da API do google-maps é utilizada aqui!!!
  */
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  language: 'pt-BR',
})(MapContainer);
