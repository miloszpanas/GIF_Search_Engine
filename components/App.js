var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'VNDkSlOSRXHTyG8nidKP1xNxqFTnh2LO';

App = React.createClass({
    getInitialState: function() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },

    handleSearch: function(searchingText) {  // 1 - pobieramy wpisywany tekst 
        this.setState({
          loading: true  // 2 sygnalizacja procesu ladowania
        });
        this.getGif(searchingText, function(gif) {  // 3 - rozpoczęcie pobierania gifa
          this.setState({  // 4 - przy ukończeniu pobierania:
            loading: false,  // a - zakończ ladowanie 
            gif: gif,  // b - ustaw nowego gifa z wyniku pobierania
            searchingText: searchingText  // c - ustaw nowy stan dla wyszukiwanego tekstu
          });
        }.bind(this));
    },

    getGif: function(searchingText, callback) {  // 1 przyjmujemy dwa parametry: wpisywany tekst i funkcję, która ma się wykonać po pobraniu gifa(callback)
        var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;  // 2 - konstruowanie adresu URL dla API giphy
        var xhr = new XMLHttpRequest();  // 3 - Wywolywanie sekwencji tworzenia zapytania XHR do serwera i wysylanie go
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status === 200) {
               var data = JSON.parse(xhr.responseText).data; // 4 - w odpwiedzi mamy obiekt z danymi. Rozpakowujemy je do zmiennej data, żebe nie pisac za każdym razem response.data
                var gif = {  // 5 - ukladanie obiektu gif na podstawie danych otrzymanych z serwera
                    url: data.fixed_width_downsampled_url,
                    sourceUrl: data.url
                };
                callback(gif);  // 6 - przekazujemy obiekt ze zmiennej do fukncji callback, którą przekazaliśmy jako drugi parametr metody getGif
            }
        };
        xhr.send();
    },

    render: function() {

        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };

        return (
          <div style={styles}>
                <h1>GIF Search Engine!</h1>
                <p>Find GIFs on <a href='http://giphy.com'>Giphy</a>. Press enter for more GIFs.</p>
                <Search onSearch={this.handleSearch}/>
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
          </div>
        );
    }
});