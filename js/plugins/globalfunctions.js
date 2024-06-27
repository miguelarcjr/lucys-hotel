/*:
 * @target MZ
 * @plugindesc Define funções globais para uso em todo o jogo.
 * @help Este plugin define funções globais que podem ser usadas em qualquer lugar do jogo.
 */

// Definir função global
function minhaFuncaoGlobal() {
    console.log("Minha função global foi chamada!");
}

function verificaTeste() {
    return false;
}
//actions: 'invisible' 'visible'    '  'comer' 'satisfeito'
function setHospede(eventId) {
    const hospede = buildHospede();
    $gameVariables.setValue(eventId, hospede);
}
function buildHospede() {
    return {
        action: 'invisible',
        horario_ini: 0,
        horario_fim: 0,
        horario_fome_ini: 0,
        horario_fome_fim: 0,
        comidaId: '',
        characterName: 'Lucy1',
        characterIndex: 5,
        tempo_saida: 0,

    }
}
function getHospedeValue(eventId, path) {
    const hospede = $gameVariables.value(eventId);
    if(!hospede) {
        return false;
    }
    return hospede[path];
}

function getVisitaValue(eventId, path) {
    const hospede = $gameVariables.value(eventId);
    if(!hospede) {
        return false;
    }
    if(!path) {
        return hospede;
    }
    return hospede[path];
}

//actions: 'inactive' 'offline', 'invisible', 'waiting', 'hosted', 'non-hosted'
function buildVisita() {
    return {
        //isActive: true,
        action: 'inactive',
        tempo_entrada: 0,
        tempo_saida: 0,
        saida: true, // define se deve executar o evento de perder saida, como observar isso?
        characterName: 'Lucy1',
        characterIndex: Math.floor(Math.random() * 6) + 2,

    }
}

function setVisitaValue(eventId, path, value) {
    const hospede = $gameVariables.value(eventId);
    if(!hospede || !path || !value) {
        return false;
    }
    hospede[path] = value;
    $gameVariables.setValue(eventId, hospede);

    return hospede;
}

function activeNewVisita() {
    const qtd_quartos = $gameVariables.value(1);
    const eventId = 200 + qtd_quartos
    setVisitaValue(eventId, 'action', 'offline');
}

function waitSaida(eventId) {
    const hospede = $gameVariables.value(eventId);
    if(!hospede) {return;}
    const verificaSaida = setInterval(function() {
        if(hospede.action !== 'invisible' && hospede.action !== 'waiting') {
            clearInterval(verificaSaida);
            return;
        }
        if(hospede.action == 'waiting') {
            if(getVisitaValue(eventId, 'tempo_saida') <= $gameVariables.value(2)) {
                //$gameMessage.add("Tempo de saida amigo!");
                setVisitaValue(eventId, 'action', 'non-hosted');
                clearInterval(verificaSaida);
            }
        }
    }, 1000);
}
function waitSaidaVendedor(eventId) {
    const hospede = $gameVariables.value(eventId);
    if(!hospede) {return;}
    const verificaSaida = setInterval(function() {
        if(hospede.action !== 'invisible' && hospede.action !== 'waiting' && hospede.action !== 'running') {
            clearInterval(verificaSaida);
            return;
        }
        if(hospede.action == 'waiting') {
            if(getVisitaValue(eventId, 'tempo_saida') <= $gameVariables.value(2)) {
                //$gameMessage.add("Tempo de saida amigo!");
                setVisitaValue(eventId, 'action', 'exiting');
                clearInterval(verificaSaida);
            }
        }
    }, 1000);
}
//Ajuda a alterar o avatar do evento para o atual
function changeAvatarVisita(eventId, visitaId) {
    const hospede = getVisitaValue(visitaId)
    const characterName = hospede.characterName; // Nome do arquivo da imagem (sem extensão)
    const characterIndex = hospede.characterIndex;       // Índice do gráfico na imagem (0 a 7)

    const event = $gameMap.event(eventId);
    // Verifica se o evento existe
    if (event) {
        // Altera o gráfico do evento
        event.setImage(characterName, characterIndex);
        // Atualiza a página do evento para refletir as mudanças
        event.refresh();
    } else {
        console.error("Evento com ID " + eventId + " não encontrado.");
    }

}

function changeGraficoVisita(eventId) {
    const valor = Math.floor(Math.random() * 8);
    const valor2 = Math.floor(Math.random() * 3) + 1;
    copyToClipboard(eventId+' | '+ valor)
    setVisitaValue(eventId, 'characterIndex', valor);
    setVisitaValue(eventId, 'characterName', 'Lucy'+valor2);
}

function setGraficoHospede(visitaId, hospedeId) {
    const visita = getValue(visitaId);
    setValue(hospedeId, 'characterIndex', visita.characterIndex);
    setValue(hospedeId, 'characterName', visita.characterName);

}

//actions: 'comprar' 'disponivel', 'ocupado'
//status_sujo: 'waiting' 'sujou'
function buildQuarto() {
    return {
        //isActive: true, 
        status_sujo: 'sujou',
        action: 'comprar',
        sujo_1: 'false',
        sujo_2: 'false',
        sujo_3: 'false',
        tempo_sujo_entrada: 0,
    }
}
//actions inactive, offline, invisible, visible, waiting
function buildEvento() {
    return {
        action: 'inactive'
    }
}

// actions: comprar | disponivel | produzindo | pronto
function buildSorveteria() {
    return {
        action: 'comprar',
        tempo_saida: 0,
    }
}
// actions: comprar | disponivel | produzindo | pronto
function buildRefrigerante() {
    return {
        action: 'comprar',
        tempo_saida: 0,
    }
}
function getValue(eventId, path) {
    const obj = $gameVariables.value(eventId);
    if(!obj) {
        return false;
    }
    if(!path) {
        return obj;
    }
    return obj[path];
}

function setValue(eventId, path, value) {
    const obj = $gameVariables.value(eventId);
    if(!obj || !path || !value) {
        return false;
    }
    obj[path] = value;
    $gameVariables.setValue(eventId, obj);

    return obj;
}
function setValueTeste(eventId, path, value) {
    const obj = $gameVariables.value(eventId);
    if(!obj || !path || !value) {
        return false;
    }
    obj[path] = value;
    $gameVariables.setValue(eventId, obj);

    return obj;
}

function buildValue(obj) {
    const data = obj;
    const newData = Object.assign(data, {})
    return newData;
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function waitFome(eventId) {
    const segundos = (60*3)+1;
    const t = {
        i: 0,
    };
    
    const intervalo = setInterval(function() {
        const evento = getValue(eventId);
        if(evento.action == 'hosted' && t.i > 60) {
            clearInterval(intervalo);
        }
        if(t.i == (60 * 1)) {
            setValue(eventId, 'action', 'hungry')
        }
        if(t.i == (60 * 3)) {
            setValue(eventId, 'action', 'hosted')
            clearInterval(intervalo);
        }
        t.i = t.i + 1;
    }, 1000)

}

function transportEvent(eventIdToTransport, targetEventId) {
    const eventToTransport = $gameMap.event(eventIdToTransport);
    const targetEvent = $gameMap.event(targetEventId);
    
    if (eventToTransport && targetEvent) {
        eventToTransport.locate(targetEvent.x, targetEvent.y);
    } else {
        console.error("Evento inválido!");
    }
}

function $sv(__this, path) {
    return $gameSelfVariables.get(__this, path)
}
function $st(__this, path, value) {
    return $gameSelfVariables.set(__this, path, value)
}

function setMultiValue(eventIdIni, eventIdFim, buildar) {
    "use strict";
    for (let i = eventIdIni; i <= eventIdFim; i++) {
        const build = buildar();
        $gameVariables.setValue(i, build);
        
    }
}

function isCocoVisible() {
    "use strict"
    let isVisible = false;
    const cocosIds = [12,13,14,15,16,17];
    for (const cocoId of cocosIds) {
        const cocoAction = getValue(cocoId, 'action');
        if(cocoAction == 'visible') {
            isVisible = true;
        }
    }
    
    return isVisible;

}