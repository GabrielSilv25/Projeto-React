/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextField, { Input } from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';

import {
  RestaurantCard,
  Modal,
  Map,
  ImageCard,
  Loader,
  Text,
  ImageSkeleton as Skeleton,
} from '../../components';
//importações do logo, pesquisa e etc...
import logo from '../../assets/logo.svg';
import { Container, Search, Logo, Title, Carousel, Wrapper } from './styles';

const Home = () => {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [placeId, setPlaceId] = useState(null);
  const [open, setOpen] = useState(false);
  const { restaurants, restaurantSelected } = useSelector((state) => state.restaurants);
  const hasRestaurants = restaurants.length > 0;

  const settings = {// estiliza slguns components do carousel
    dots: false, // São os pontos de troca de slide
    infinite: true, // Infinidade de informação, causa o lupe 
    autoplay: true, //automatização do play
    speed: 300, // a velocidade
    slidesToShow: 4, // quantos slides mostra
    slidesToScroll: 4, 
    adaptiveHeight: true, // se adapta a altura do conteudo em si
  };

  const renderCarousel = () => {
    if (hasRestaurants) {
      return (
        <>
          <Title size="large">Na sua Área</Title>
          <Carousel {...settings}>
            {restaurants.map((restaurant) => (
              <ImageCard key={restaurant.place_id} restaurant={restaurant} />
            ))}
          </Carousel>
        </>
      );
    }
    return <Loader />;
  };

  const renderRestaurants = () => {
    if (hasRestaurants) {
      return restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.place_id}
          restaurant={restaurant}
          onClick={() => {
            setPlaceId(restaurant.place_id);
            setOpen(true);
          }}
        />
      ));
    }
    return null;
  };

  const handleChange = (e) => { 
    // é quando o usuário faz a busca de um restaurante
    setValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    // essa função fará com que se ache o restaurante
    if (e.key === 'Enter') {
      setQuery(value);
    }
  };

  /*
  o modal fará com que informações de edereço,
  nome e horario de abertura sejam mostradas ao
  usuario.
  */

  return (
    <Wrapper>
      <Container>
        <Search>
          <Logo src={logo} alt="logo da empresa" />
          <TextField
            outlined //é oq faz a palavra "pesquisar" subir pra alinhação
            label="Pesquisar"//é o que mostra dentro do enquadramento de 'search'
            trailingIcon={<MaterialIcon role="button" icon="search" />}//Ícone da lupa
          >
            <Input type="text" value={value} onKeyPress={handleKeyPress} onChange={handleChange} />
          </TextField>
          {renderCarousel()}
        </Search>
        {renderRestaurants()}
        <Modal open={open} onClose={() => setOpen(false)}>
          {restaurantSelected ? (
            <>
              <Text size="large">{restaurantSelected?.name}</Text>
              <Text size="medium">{restaurantSelected?.formatted_phone_number}</Text>
              <Text size="medium">{restaurantSelected?.formatted_address}</Text>
              <Text size="medium"> 
                {restaurantSelected?.opening_hours?.open_now
                  ? 'Aberto agora :)'
                  : 'Fechado neste momento :('}
              </Text>
            </>
          ) : (
            <>
              <Skeleton width="10px" height="10px" />
              <Skeleton width="10px" height="10px" />
              <Skeleton width="10px" height="10px" />
              <Skeleton width="10px" height="10px" />
            </>
          )}
        </Modal> 
      </Container>
      <Map query={query} placeId={placeId} />
    </Wrapper>
  );
};

export default Home;
