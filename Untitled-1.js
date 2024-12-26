// Menggunakan jQuery dan Vanilla JS untuk fungsionalitas dinamis
$(document).ready(function () {

    // Mengatur Event untuk Voting
    $('.vote-btn').on('click', function () {
        var voteType = $(this).data('vote');
        var postId = $(this).data('postid');
        
        // Kirim vote ke server
        $.ajax({
            url: '/api/vote',  // Endpoint untuk menerima vote
            type: 'POST',
            data: {
                postId: postId,
                voteType: voteType
            },
            success: function(response) {
                if (response.success) {
                    alert('Vote berhasil!');
                    // Perbarui jumlah vote di halaman
                    $('#votes-' + postId).text(response.totalVotes);
                } else {
                    alert('Gagal memberikan vote.');
                }
            },
            error: function() {
                alert('Terjadi kesalahan. Silakan coba lagi.');
            }
        });
    });

    // Pencarian Dinamis menggunakan Fuzzy Search (contoh menggunakan Fuse.js)
    const options = {
        includeScore: true,
        keys: ['title', 'content']
    };
    const fuse = new Fuse(data, options);  // data: array artikel
    $('#search-input').on('input', function () {
        const query = $(this).val();
        const results = fuse.search(query);
        renderSearchResults(results);
    });

    // Menampilkan Hasil Pencarian
    function renderSearchResults(results) {
        let html = '';
        results.forEach(result => {
            html += `<div class="search-result">
                        <h3>${result.item.title}</h3>
                        <p>${result.item.content}</p>
                      </div>`;
        });
        $('#search-results').html(html);
    }

    // Komentar Real-Time dengan WebSocket (misalnya, menggunakan Socket.io)
    const socket = io.connect('http://localhost:3000');  // Menghubungkan ke server WebSocket
    
    // Mendengarkan Pesan Baru dari WebSocket (komentar baru)
    socket.on('newComment', function (comment) {
        $('#comments-section').prepend(`
            <div class="comment">
                <strong>${comment.author}:</strong>
                <p>${comment.text}</p>
            </div>
        `);
    });

    // Mengirim Komentar Baru ke Server via WebSocket
    $('#comment-form').submit(function (e) {
        e.preventDefault();
        const commentText = $('#comment-input').val();
        const postId = $('#post-id').val();

        socket.emit('newComment', { postId: postId, text: commentText });

        // Reset input komentar
        $('#comment-input').val('');
    });

    // Formulir Suara Rakyat dengan Validasi dan Transisi
    $('#voice-form').submit(function (e) {
        e.preventDefault();
        const name = $('#name').val();
        const message = $('#message').val();

        if (name === '' || message === '') {
            alert('Form belum lengkap!');
            return;
        }

        // Kirim data formulir ke server (misalnya, API)
        $.ajax({
            url: '/api/submit-voice',
            type: 'POST',
            data: { name: name, message: message },
            success: function(response) {
                if (response.success) {
                    alert('Suara Anda sudah terkirim!');
                    $('#voice-form').trigger('reset');
                } else {
                    alert('Gagal mengirim suara.');
                }
            },
            error: function() {
                alert('Terjadi kesalahan, silakan coba lagi.');
            }
        });
    });

    // Inisialisasi Peta Interaktif dengan Leaflet.js
    const map = L.map('map').setView([51.505, -0.09], 2); // Lokasi default peta

    // Menghubungkan ke peta OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Menambahkan Marker di Peta
    const markers = [
        { lat: 51.5, lng: -0.09, message: 'Isu Pendidikan di London' },
        { lat: 48.8566, lng: 2.3522, message: 'Isu Kesehatan di Paris' },
    ];

    markers.forEach(marker => {
        const markerObj = L.marker([marker.lat, marker.lng]).addTo(map);
        markerObj.bindPopup(`<b>${marker.message}</b>`).openPopup();
    });

});

// Menggunakan Fuse.js untuk Pencarian Dinamis
const data = [
    { title: 'Pendidikan di Daerah Terpencil', content: 'Akses pendidikan yang merata di wilayah terpencil sangat dibutuhkan.' },
    { title: 'Peningkatan Infrastruktur di Desa', content: 'Pembangunan infrastruktur di desa untuk kesejahteraan rakyat.' },
    { title: 'Kesehatan di Masa Pandemi', content: 'Layanan kesehatan di masa pandemi sangat penting untuk masyarakat.' },
];
