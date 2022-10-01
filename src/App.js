import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import axios from 'axios';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DoneIcon from '@mui/icons-material/Done';

function App() {
  const current_word = "delicious";

  const [newSubWord, setNewSubWord] = useState('');
  const [subwordList, setSubwordList] = useState([]);




  const characterHashMap = new Map();
  for (var i = 0; i < current_word.length; i++) {
    var c = current_word.charAt(i);
    if (characterHashMap.get(c) === undefined)
      characterHashMap.set(c, 1);
    else
      characterHashMap.set(c, characterHashMap.get(c) + 1);
  }


 
  const checkWordIsSubWord = (subword) => {
    var newMap = new Map(characterHashMap);
    for (var i = 0; i < subword.length; i++) {
      var c = subword.charAt(i);
      if (newMap.get(c) === undefined)
        return false;
      else
      {
        if(newMap.get(c)==1)
        {
          newMap.delete(c);
        }
        else
          newMap.set(c, newMap.get(c) - 1);
        return true;
      }
    }
  }

  const handleClick = () => {
    var isWordValid = checkWordIsSubWord(newSubWord);
    if(!isWordValid)
    {
      alert('Word entered is not a subword of ' + current_word +  ', please enter another word');
      setNewSubWord('');
      return;
    }
    if(subwordList.includes(newSubWord))
    {
      alert('Word already exist, please try again.');
      setNewSubWord('');
      return;
    }
    axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/" + newSubWord)
      .then(response => {
        if (response.status == 200) {
          setSubwordList(subwordList.concat(response.data[0].word));
          setNewSubWord('');
        }

      })
      .catch((res) => {
        alert('The word ' + newSubWord + ' is not found in the dictionary, please try again.');
        console.log(res);
        setNewSubWord('');
      }
      );

  }

  // 
  return (
    <div style={{ justifyContent: 'center', alignItems: 'center', margin: '100px', fontFamily: 'Calbri' }}>
      <h3>Current Word</h3>
      <h2 style={{ color: 'blue' }}>{current_word}</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {
          subwordList.length == 0 ?
            <div> Enter a sub word to start game. </div> :

            subwordList.map((word) =>
              // <ListItem key={word} alignItems="flex-start" style={{ display: 'list-item' }}> {word} </ListItem>
              <Card key={word} variant="outlined" style={{ width: '8rem' }}>
                <CardContent>
                  <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                    {word}
                  </Typography>
                  <DoneIcon />
                </CardContent>

              </Card>
            )


        }
        <br />
      </div>
      <br />
      <TextField autoComplete='off' id="newSubWord" label="enter sub word & submit" variant="outlined" value={newSubWord} onChange={(v) => { setNewSubWord(v.target.value); }} /> <br /><br />
      <Button variant="contained" onClick={handleClick}>Submit</Button>
      <br />
    </div>
  );
}

export default App;
