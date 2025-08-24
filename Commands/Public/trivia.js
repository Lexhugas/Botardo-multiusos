const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const triviaQuestions = [
    { question: "¿Cuál es la capital de España?", options: ["Madrid", "Barcelona", "Sevilla", "Valencia"], correctAnswer: "Madrid" },
    { question: "¿En qué año llegó el hombre a la luna?", options: ["1969", "1970", "1968", "1971"], correctAnswer: "1969" },
    { question: "¿Quién pintó la Mona Lisa?", options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"], correctAnswer: "Leonardo da Vinci" },
    { question: "¿Cuál es el océano más grande del mundo?", options: ["Océano Pacífico", "Océano Atlántico", "Océano Índico", "Océano Ártico"], correctAnswer: "Océano Pacífico" },
    { question: "¿Quién escribió 'Cien años de soledad'?", options: ["Gabriel García Márquez", "Mario Vargas Llosa", "Carlos Fuentes", "Julio Cortázar"], correctAnswer: "Gabriel García Márquez" },
    { question: "¿Cuál es la moneda oficial de Japón?", options: ["Yen", "Won", "Dólar", "Peso"], correctAnswer: "Yen" },
    { question: "¿En qué continente se encuentra Egipto?", options: ["África", "Asia", "Europa", "Oceanía"], correctAnswer: "África" },
    { question: "¿Qué planeta es conocido como el 'planeta rojo'?", options: ["Marte", "Venus", "Saturno", "Júpiter"], correctAnswer: "Marte" },
    { question: "¿Cuál es el animal terrestre más grande?", options: ["Elefante", "Ballena", "Rinoceronte", "Hipopótamo"], correctAnswer: "Elefante" },
    { question: "¿Cómo se llama el sistema operativo creado por Microsoft?", options: ["Windows", "MacOS", "Linux", "Android"], correctAnswer: "Windows" },
    { question: "¿Qué instrumento musical tiene 88 teclas?", options: ["Piano", "Guitarra", "Violín", "Saxo"], correctAnswer: "Piano" },
    { question: "¿Qué país tiene la mayor población mundial?", options: ["China", "India", "EEUU", "Rusia"], correctAnswer: "China" },
    { question: "¿Qué tipo de animal es un tiburón?", options: ["Peces", "Reptiles", "Mamíferos", "Aves"], correctAnswer: "Peces" },
    { question: "¿Quién fue el primer presidente de los Estados Unidos?", options: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"], correctAnswer: "George Washington" },
    { question: "¿Cuántos colores tiene el arco iris?", options: ["7", "6", "8", "5"], correctAnswer: "7" },
    { question: "¿En qué año se hundió el Titanic?", options: ["1912", "1890", "1923", "1945"], correctAnswer: "1912" },
    { question: "¿Cuál es el deporte más popular del mundo?", options: ["Fútbol", "Baloncesto", "Béisbol", "Rugby"], correctAnswer: "Fútbol" },
    { question: "¿Cuál es el continente más pequeño?", options: ["Oceanía", "Asia", "Europa", "África"], correctAnswer: "Oceanía" },
    { question: "¿Quién fue el autor de 'Don Quijote de la Mancha'?", options: ["Miguel de Cervantes", "William Shakespeare", "Gabriel García Márquez", "Jorge Luis Borges"], correctAnswer: "Miguel de Cervantes" },
    { question: "¿Qué elemento químico tiene el símbolo O?", options: ["Oxígeno", "Osmio", "Oro", "Oganesón"], correctAnswer: "Oxígeno" },
    { question: "¿Cuántos jugadores tiene un equipo de fútbol en el campo?", options: ["11", "10", "12", "9"], correctAnswer: "11" },
    { question: "¿Qué guerra se libró entre 1914 y 1918?", options: ["Primera Guerra Mundial", "Segunda Guerra Mundial", "Guerra de Vietnam", "Guerra Fría"], correctAnswer: "Primera Guerra Mundial" },
    { question: "¿Cuál es el río más largo del mundo?", options: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"], correctAnswer: "Amazonas" },
    { question: "¿Qué animal es conocido por su habilidad para imitar sonidos humanos?", options: ["Loro", "Gato", "Perro", "Mono"], correctAnswer: "Loro" },
    { question: "¿Quién pintó la Capilla Sixtina?", options: ["Miguel Ángel", "Leonardo da Vinci", "Raphael", "El Greco"], correctAnswer: "Miguel Ángel" },
    { question: "¿Qué fecha marca el inicio de la Revolución Francesa?", options: ["1789", "1776", "1812", "1860"], correctAnswer: "1789" },
    { question: "¿En qué ciudad se encuentra la Torre Eiffel?", options: ["París", "Roma", "Londres", "Berlín"], correctAnswer: "París" },
    { question: "¿Qué animal es conocido como el rey de la selva?", options: ["León", "Elefante", "Tigre", "Pantera"], correctAnswer: "León" },
    { question: "¿Quién inventó la bombilla?", options: ["Thomas Edison", "Nikola Tesla", "Galileo Galilei", "Albert Einstein"], correctAnswer: "Thomas Edison" },
    { question: "¿Cuál es el nombre del río que atraviesa Egipto?", options: ["Nilo", "Amazonas", "Yangtsé", "Mississippi"], correctAnswer: "Nilo" },
    { question: "¿Cuál es el idioma más hablado en el mundo?", options: ["Chino mandarín", "Inglés", "Español", "Hindi"], correctAnswer: "Chino mandarín" },
    { question: "¿Qué país tiene la mayor cantidad de islas del mundo?", options: ["Suecia", "Canadá", "Filipinas", "Indonesia"], correctAnswer: "Suecia" },
    { question: "¿Qué famoso físico desarrolló la teoría de la relatividad?", options: ["Albert Einstein", "Isaac Newton", "Niels Bohr", "Marie Curie"], correctAnswer: "Albert Einstein" },
    { question: "¿Qué continente tiene más países?", options: ["África", "Asia", "Europa", "América"], correctAnswer: "África" },
    { question: "¿Cuál es la capital de Australia?", options: ["Canberra", "Sídney", "Melbourne", "Brisbane"], correctAnswer: "Canberra" },
    { question: "¿Qué es el sistema solar?", options: ["Un conjunto de planetas", "Una estrella", "Un satélite natural", "Un agujero negro"], correctAnswer: "Un conjunto de planetas" },
    { question: "¿Qué país es conocido por su producción de chocolates?", options: ["Suiza", "Francia", "Bélgica", "España"], correctAnswer: "Suiza" },
    { question: "¿Cuál es el animal más rápido del mundo?", options: ["Guepardo", "León", "Tiburón", "Águila"], correctAnswer: "Guepardo" },
    { question: "¿Qué instrumento se utiliza para medir la temperatura?", options: ["Termómetro", "Barómetro", "Higrómetro", "Manómetro"], correctAnswer: "Termómetro" },
    { question: "¿Cuál es la montaña más alta del mundo?", options: ["Everest", "K2", "Mont Blanc", "Aconcagua"], correctAnswer: "Everest" },
    { question: "¿Cuál es la capital de Italia?", options: ["Roma", "Venecia", "Milán", "Florencia"], correctAnswer: "Roma" },
    { question: "¿Quién fue el primer hombre en caminar sobre la luna?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Michael Collins"], correctAnswer: "Neil Armstrong" },
    { question: "¿Qué idioma se habla en Brasil?", options: ["Portugués", "Español", "Inglés", "Francés"], correctAnswer: "Portugués" },
    { question: "¿Qué país inventó la pizza?", options: ["Italia", "Francia", "Grecia", "España"], correctAnswer: "Italia" },
    { question: "¿Qué órgano del cuerpo humano es el encargado de bombear sangre?", options: ["Corazón", "Pulmones", "Riñón", "Hígado"], correctAnswer: "Corazón" },
    { question: "¿Qué es el sol?", options: ["Una estrella", "Un planeta", "Un satélite", "Un asteroide"], correctAnswer: "Una estrella" },
    { question: "¿Cuál es el continente más grande?", options: ["Asia", "África", "América", "Oceanía"], correctAnswer: "Asia" },
    { question: "¿En qué ciudad se encuentra la Estatua de la Libertad?", options: ["Nueva York", "París", "Londres", "Roma"], correctAnswer: "Nueva York" },
    { question: "¿Quién es el autor de 'Harry Potter'?", options: ["J.K. Rowling", "George R.R. Martin", "J.R.R. Tolkien", "Suzanne Collins"], correctAnswer: "J.K. Rowling" },
    { question: "¿Qué se celebra el 14 de febrero?", options: ["San Valentín", "Navidad", "Halloween", "Día de Acción de Gracias"], correctAnswer: "San Valentín" },
    { question: "¿Cuál es el símbolo químico del agua?", options: ["H2O", "CO2", "O2", "NaCl"], correctAnswer: "H2O" },
    { question: "¿Qué animal tiene el cuello más largo?", options: ["Jirafa", "Cebra", "Elefante", "Hipopótamo"], correctAnswer: "Jirafa" },
    { question: "¿Qué científico formuló las leyes del movimiento?", options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Niels Bohr"], correctAnswer: "Isaac Newton" },
    { question: "¿Qué isla es la más grande del mundo?", options: ["Groenlandia", "Australia", "Antártida", "Islandia"], correctAnswer: "Groenlandia" },
    { question: "¿Cuál es el sistema de escritura usado en Japón?", options: ["Kanji", "Cirílico", "Latino", "Árabe"], correctAnswer: "Kanji" },
    { question: "¿Cuál es el color que resulta de mezclar rojo y azul?", options: ["Morado", "Verde", "Naranja", "Amarillo"], correctAnswer: "Morado" },
    { question: "¿En qué país se originó el sushi?", options: ["Japón", "China", "Tailandia", "Corea"], correctAnswer: "Japón" },
    { question: "¿Cuál es el nombre del primer satélite artificial?", options: ["Sputnik", "Apollo", "Vostok", "Gemini"], correctAnswer: "Sputnik" },
    { question: "¿Quién inventó el teléfono?", options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Michael Faraday"], correctAnswer: "Alexander Graham Bell" },
    { question: "¿Qué tipo de animal es un delfín?", options: ["Mamífero", "Pez", "Reptil", "Anfibio"], correctAnswer: "Mamífero" },
    { question: "¿Qué país es conocido como la tierra del sol naciente?", options: ["Japón", "China", "Corea del Sur", "Tailandia"], correctAnswer: "Japón" },
    { question: "¿Qué ciudad es conocida como la 'Gran Manzana'?", options: ["Nueva York", "Los Ángeles", "Chicago", "San Francisco"], correctAnswer: "Nueva York" },
    { question: "¿Cuántos continentes hay en el mundo?", options: ["7", "6", "8", "5"], correctAnswer: "7" },
    { question: "¿Quién pintó 'La última cena'?", options: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"], correctAnswer: "Leonardo da Vinci" },
    { question: "¿Qué evento histórico ocurrió en 1492?", options: ["Descubrimiento de América", "La Revolución Francesa", "La caída del Imperio Romano", "La llegada del hombre a la luna"], correctAnswer: "Descubrimiento de América" },
    { question: "¿Quién fundó la teoría de la evolución?", options: ["Charles Darwin", "Albert Einstein", "Isaac Newton", "Louis Pasteur"], correctAnswer: "Charles Darwin" },
    { question: "¿Qué lenguaje de programación fue creado por James Gosling?", options: ["Java", "Python", "C", "Ruby"], correctAnswer: "Java" },
    { question: "¿Qué tipo de animal es un camello?", options: ["Mamífero", "Reptil", "Pez", "Aves"], correctAnswer: "Mamífero" },
    { question: "¿En qué año terminó la Segunda Guerra Mundial?", options: ["1945", "1940", "1939", "1942"], correctAnswer: "1945" },
    { question: "¿Qué gas es necesario para la respiración de los seres humanos?", options: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Helio"], correctAnswer: "Oxígeno" },
    { question: "¿Qué continente tiene el mayor número de países?", options: ["África", "Asia", "Europa", "América"], correctAnswer: "África" },
    { question: "¿Cómo se llama el continente que está formado por Australia y otras islas?", options: ["Oceanía", "Asia", "África", "Europa"], correctAnswer: "Oceanía" },
    { question: "¿Qué es lo que usamos para escribir en una pizarra?", options: ["Marcador", "Tiza", "Lápiz", "Pincel"], correctAnswer: "Tiza" }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('¡Juega a Trivia y demuestra tus conocimientos!'),

    async execute(interaction) {
        const questionData = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];

        const embed = new EmbedBuilder()
            .setTitle('🎮 Trivia')
            .setDescription(`Pregunta: ${questionData.question}`)
            .addFields(
                { name: 'Opciones', value: `${questionData.options.join('\n')}` }
            )
            .setColor(0x00FFFF) 
            .setFooter({ text: '¡Tienes 15 segundos para responder!' })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });

        const filter = response => {
            return response.author.id === interaction.user.id && questionData.options.some(option => option.toLowerCase() === response.content.toLowerCase());
        };

        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 }); // 15 segundos para responder

        collector.on('collect', async (message) => {
            const userAnswer = message.content.trim();

            let resultEmbed = new EmbedBuilder()
                .setTitle('🎮 Trivia')
                .setDescription(`Pregunta: ${questionData.question}`)
                .addFields(
                    { name: 'Tu respuesta', value: `${userAnswer}`, inline: true },
                    { name: 'Respuesta correcta', value: `${questionData.correctAnswer}`, inline: true }
                )
                .setColor(userAnswer.toLowerCase() === questionData.correctAnswer.toLowerCase() ? 0x00FF00 : 0xFF0000) // Verde para correcta, rojo para incorrecta
                .setFooter({ text: userAnswer.toLowerCase() === questionData.correctAnswer.toLowerCase() ? '¡Respuesta correcta!' : '¡Respuesta incorrecta!' })
                .setTimestamp();

            await interaction.editReply({ embeds: [resultEmbed] });

            collector.stop(); 
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                const timeoutEmbed = new EmbedBuilder()
                    .setTitle('🎮 Trivia')
                    .setDescription(`Se acabó el tiempo. La respuesta correcta era: ${questionData.correctAnswer}`)
                    .setColor(0xFF0000) 
                    .setFooter({ text: '¡Intenta nuevamente!' })
                    .setTimestamp();

                await interaction.editReply({ embeds: [timeoutEmbed] });
            }
        });
    }
};
