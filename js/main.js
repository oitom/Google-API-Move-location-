function initialize() {
	var mapOptions, map, marker, searchBox, city,
		infoWindow = '',
		addressEl = document.querySelector('#map-search'),
		element = document.getElementById('map-canvas'),
		latEl = document.querySelector('.latitude'),
		longEl = document.querySelector('.longitude'),
		cep = document.querySelector('.cep'),
		rua = document.querySelector('.rua'),
		numero = document.querySelector('.numero'),
		bairro = document.querySelector('.bairro'),
		cidade = document.querySelector('.cidade');

	mapOptions = {
		zoom: 4,
		center: new google.maps.LatLng(-11.481876976562393, -53.07346688899998),
		disableDefaultUI: false,
		scrollWheel: true,
		draggable: true
	};

	map = new google.maps.Map(element, mapOptions);

	marker = new google.maps.Marker({
		position: mapOptions.center,
		map: map,
		draggable: true
	});
	
	searchBox = new google.maps.places.SearchBox(addressEl);

	google.maps.event.addListener(searchBox, 'places_changed', function () {
		var places = searchBox.getPlaces(),
			bounds = new google.maps.LatLngBounds(),
			i, place, lat, long, resultArray,
			addresss = places[0].formatted_address;

		for(i = 0; place = places[i]; i++ ) {
			bounds.extend(place.geometry.location);
			marker.setPosition(place.geometry.location);
		}

		map.fitBounds(bounds);
		map.setZoom(17);

		lat = marker.getPosition().lat();
		long = marker.getPosition().lng();
		latEl.value = lat;
		longEl.value = long;

		resultArray =  places[0].address_components;
		for(var i = 0; i < resultArray.length; i++) {
			if (resultArray[i].types[0] == "postal_code")
				cep.value = resultArray[i].long_name;
			if (resultArray[i].types[0] == "street_number")
				numero.value = resultArray[i].long_name;
			if (resultArray[i].types[0] == "route")
				rua.value = resultArray[i].long_name;
			if (resultArray[i].types[0] == "political" || resultArray[i].types[0] == "sublocality_level_1" || resultArray[i].types[0] == "sublocality")
				bairro.value = resultArray[i].long_name;
			if (resultArray[i].types[0] == "administrative_area_level_2")
				cidade.value = resultArray[i].long_name;
		}

		if (infoWindow)
			infoWindow.close();

		infoWindow = new google.maps.InfoWindow({
			content: addresss
		});

		infoWindow.open( map, marker );
	});

	google.maps.event.addListener( marker, "dragend", function ( event ) {
		var lat, long, address, resultArray, citi;
		lat = marker.getPosition().lat();
		long = marker.getPosition().lng();

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { latLng: marker.getPosition() }, function ( result, status ) {
			if ('OK' === status) {
				address = result[0].formatted_address;
				resultArray =  result[0].address_components;
				console.log(resultArray);
				
				for(var i = 0; i < resultArray.length; i++ ) {
					if (resultArray[i].types[0] == "postal_code")
						cep.value = resultArray[i].long_name;
					if (resultArray[i].types[0] == "street_number")
						numero.value = resultArray[i].long_name;
					if (resultArray[i].types[0] == "route")
						rua.value = resultArray[i].long_name;
					if (resultArray[i].types[0] == "political" || resultArray[i].types[0] == "sublocality_level_1" || resultArray[i].types[0] == "sublocality")
						bairro.value = resultArray[i].long_name;
					if (resultArray[i].types[0] == "administrative_area_level_2")
						cidade.value = resultArray[i].long_name;
				}
				addressEl.value = address;
				latEl.value = lat;
				longEl.value = long;

			} 
			else
				console.log('Geocode was not successful for the following reason: ' + status);	

			if (infoWindow)
				infoWindow.close();

			infoWindow = new google.maps.InfoWindow({
				content: address
			});

			infoWindow.open( map, marker );
		});
	});
}