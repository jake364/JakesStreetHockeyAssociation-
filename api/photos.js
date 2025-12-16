export default function handler(req, res) {
  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
      caption: 'Epic game winning goal by Jake #23',
      date: '2025-11-10'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
      caption: 'Team celebration after championship win',
      date: '2025-11-08'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1484068699263-1ac9ecc8af37?w=800',
      caption: 'Intense face-off action',
      date: '2025-11-05'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800',
      caption: 'Red Rockets team photo',
      date: '2025-11-03'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      caption: 'Amazing save by our goalie',
      date: '2025-10-28'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800',
      caption: 'Street hockey at sunset',
      date: '2025-10-25'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1578068130-8e0095e4682f?w=800',
      caption: 'Youth league championship trophy',
      date: '2025-10-20'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800',
      caption: 'New team jerseys reveal',
      date: '2025-10-15'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800',
      caption: 'Practice makes perfect',
      date: '2025-10-10'
    }
  ];

  res.status(200).json(photos);
}
