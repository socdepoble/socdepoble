import { useNavigate } from 'react-router-dom';

export default function MyProcedures({ entity }) {
  const navigate = useNavigate();

  const procedures = [
      {
          id: 'xylella',
          title: 'Declaració de la Xylella',
          author_name: 'Conselleria d\'Agricultura',
          town_name: 'Tràmit GVA',
          description: 'Genera el document oficial GVA (F121093) per comunicar tractaments contra la Xylella fastidiosa a les teues parcel·les.',
          type: 'official',
          image_url: '/assets/places/nano_palau_comtal_1774195484197.png',
          category: 'Administració',
          created_at: new Date().toISOString()
      },
      {
          id: 'cessio-terres',
          title: 'Cessió de Terres',
          author_name: 'Banc de Terres',
          town_name: 'Sóc de Poble',
          description: 'Aquest tràmit està en desenvolupament (Pròximament).',
          type: 'post',
          image_url: '/assets/avatars/nano_fibra_espart.png',
          category: 'Pendent',
          created_at: new Date().toISOString()
      }
  ];

  return (
    <Box className="w-full max-w-4xl mx-auto px-2">
        <Stack spacing="lg">
            <Box className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl mb-4">
                <Text as="p" className="text-sm font-bold text-orange-400">
                    Aquesta és la teua Zona Personal segura. Tota generació de documents oficials es fa 100% offline (al teu dispositiu) per garantir la màxima privacitat. Cap dada personal ix del teu terminal.
                </Text>
            </Box>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {procedures.map(proc => (
                    <UniversalCard
                        key={proc.id}
                        item={proc}
                        variant={proc.type}
                        onNavigate={() => navigate(`/ofici/${proc.id}`)}
                    />
                ))}
            </div>
        </Stack>
    </Box>
  );
}
