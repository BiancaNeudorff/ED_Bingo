var BINGO = BINGO || {};

BINGO.ballCount;
BINGO.ballsArr  = [];
BINGO.cardCells = document.getElementsByClassName( 'js-card-cell' );
BINGO.domElems  = {
    drawButton  : document.getElementById( 'js-draw' ),
    resetButton : document.getElementById( 'js-reset' ),
    cardButton  : document.getElementById( 'js-card' ),
    drawHistory : document.getElementById( 'js-history' ),
    drawnLast   : document.getElementById( 'js-last-num' )
};

BINGO.populateBallsArray = () => {

    for ( let i = BINGO.ballCount; i >= 1; i-- ) {

        if ( i >= 1  && i <= 15 ) BINGO.ballsArr.push( 'B-' + i );
        if ( i >= 16 && i <= 30 ) BINGO.ballsArr.push( 'I-' + i );
        if ( i >= 31 && i <= 45 ) BINGO.ballsArr.push( 'N-' + i );
        if ( i >= 46 && i <= 60 ) BINGO.ballsArr.push( 'G-' + i );

    }

};

BINGO.addClassOnClick = ( obj, cl ) => {

    [ ...obj ].map( el => {

        el.addEventListener( 'click', () => {

            el.classList.contains( cl ) ? el.classList.remove( cl ) : el.classList.add( cl );

        } );

    });

};

(BINGO.init = () => {

    BINGO.ballCount = 75;

    BINGO.populateBallsArray();
    BINGO.addClassOnClick( BINGO.cardCells, 'marked' );

})();

BINGO.isValidNumber = ( num, arr = [] ) => {

    if ( !arr.includes( num ) ) {

        return true;

    } else {

        return false;

    }

};

BINGO.generateRandomNumber = ( max, min = 0, arr = [] ) => {

    const _max = Math.floor( max );
    const _min = Math.ceil( min );
    const _arr = arr;
    
    const _num = Math.floor( Math.random() * ( _max - _min + 1 ) ) + _min;

    
    if ( BINGO.isValidNumber( _num, _arr ) ) {

        _arr.push( _num );

        return _num;

    } else {

        
        return BINGO.generateRandomNumber( _max, _min, _arr );

    }

};

BINGO.randomBallSelector = () => {

    const _ballCount  = BINGO.ballsArr.length;
    const _randomBall = BINGO.generateRandomNumber( _ballCount - 1 );

    return BINGO.ballsArr[ _randomBall ];

};

BINGO.popBall = ball => {

    const _ballIndex = BINGO.ballsArr.indexOf( ball );

    if ( _ballIndex > -1 ) BINGO.ballsArr.splice( _ballIndex, 1 );

    return BINGO;

};


BINGO.updateDrawHistory = ball => {

    const _node     = document.createElement( 'li' );
    const _textnode = document.createTextNode( ball );

    
    _node.appendChild( _textnode );

    
    BINGO.domElems.drawHistory.appendChild( _node );

    
    BINGO.domElems.drawHistory.scrollTop = BINGO.domElems.drawHistory.scrollHeight;

    return BINGO;

};

BINGO.updateLastDrawn = ball => {

    BINGO.domElems.drawnLast.innerHTML = ball;

    return BINGO;

};

BINGO.highlightDrawnBall = ball => {

    // última bola sorteada
    const _drawnBalls = document.getElementsByClassName( 'last' );

    for ( let i = _drawnBalls.length - 1; i >= 0; i-- ) {

        // remove a marcação da bola
        _drawnBalls[ i ].classList.remove( 'last' );

    }

    // faz marcação na bola que foi sorteada
    document.getElementById( 'js-caller-' + ball ).classList.add( 'drawn', 'last' );

    return BINGO;

};

BINGO.highlightCardCell = number => {

    let _cell = document.getElementById( 'js-card-' + number );

    if ( !!_cell ) _cell.classList.add( 'marked' );

    return BINGO;

};

BINGO.resetGame = () => {
  
    const _tds  = document.getElementsByClassName( 'drawn' );

    // reseta variáveis globais
    BINGO.ballsArr = [];
    BINGO.domElems.drawnLast.innerHTML = 'Click to Draw';
    BINGO.domElems.drawHistory.innerHTML = '';

    // reseta todos os estilos de CSS 
    for ( let i = _tds.length - 1; i >= 0; i-- ) {

        _tds[ i ].classList.remove( 'drawn', 'last' );

    }

    
    BINGO.domElems.resetButton.classList.add( 'display-none' );

    
    BINGO.domElems.drawButton.disabled = false;

    BINGO.domElems.drawButton.classList.remove( 'disabled' );
    
    BINGO.domElems.drawButton.focus();

    
    BINGO.init();

}

/* Popula a cartela com números aleatórios */
BINGO.populateCard = () => {

    let _cardNumsArr = [];

    for ( let i = BINGO.cardCells.length - 1; i >= 0; i-- ) {

        let _randomNumber = BINGO.generateRandomNumber( BINGO.cardCells[ i ].dataset.max,
                                                        BINGO.cardCells[ i ].dataset.min,
                                                        _cardNumsArr );

        BINGO.cardCells[ i ].classList.remove( 'marked' );
        BINGO.cardCells[ i ].innerHTML = _randomNumber;
        BINGO.cardCells[ i ].id = 'js-card-' + _randomNumber;

    }

};

BINGO.drawBall = () => {

    const _ball = BINGO.randomBallSelector();
    const _drawnNumber = parseInt( _ball.split( '-' )[ 1 ] );

    if( BINGO.ballCount > 0 ) {

        BINGO.popBall( _ball )
             .updateDrawHistory( _ball )
             .updateLastDrawn( _ball )
             .highlightDrawnBall( _ball )
             .highlightCardCell( _drawnNumber );

        BINGO.ballCount--;

        if( BINGO.ballCount === 0 ) {

            
            BINGO.domElems.drawButton.disabled = true;
            BINGO.domElems.drawButton.classList.add( 'disabled' );
            
            BINGO.domElems.resetButton.classList.remove( 'display-none' );

        }

    }

};

BINGO.domElems.drawButton.addEventListener( 'click', BINGO.drawBall );
BINGO.domElems.resetButton.addEventListener( 'click', BINGO.resetGame );
BINGO.domElems.cardButton.addEventListener( 'click', BINGO.populateCard );


