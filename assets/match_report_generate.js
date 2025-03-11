document.addEventListener('DOMContentLoaded', function() {
    // Initialize date and time pickers
    const today = new Date();
    document.getElementById('tournamentDatePicker').valueAsDate = today;
    
    // Set current time (rounded to nearest half hour)
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 30) * 30);
    document.getElementById('tournamentTimePicker').value = 
      now.getHours().toString().padStart(2, '0') + ':' + 
      now.getMinutes().toString().padStart(2, '0');
    
    // Update formatted date display
    updateFormattedDateTime();
    
    // Add event listeners for date/time changes
    document.getElementById('tournamentDatePicker').addEventListener('change', updateFormattedDateTime);
    document.getElementById('tournamentTimePicker').addEventListener('change', updateFormattedDateTime);
    
    function updateFormattedDateTime() {
      const datePicker = document.getElementById('tournamentDatePicker');
      const timePicker = document.getElementById('tournamentTimePicker');
      
      if (!datePicker.value) return;
      
      const dateObj = new Date(datePicker.value + 'T' + (timePicker.value || '00:00'));
      
      // Format: DD/MM/YYYY HH:MM
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      
      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;
      
      document.getElementById('formattedDateTime').textContent = formattedDateTime;
      document.getElementById('tournamentDate').value = formattedDateTime;
    }
    
    // Parse format input when pasted
    document.getElementById('formatInput').addEventListener('input', function() {
      parseFormatInput(this.value);
    });
    
    // Preview uploaded logos
    document.getElementById('homeTeamLogo').addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
          document.getElementById('homeLogoPreview').src = event.target.result;
          document.getElementById('homeLogoDisplay').src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    });
    
    document.getElementById('awayTeamLogo').addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
          document.getElementById('awayLogoPreview').src = event.target.result;
          document.getElementById('awayLogoDisplay').src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    });
    
    document.getElementById('tournamentLogo').addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
          document.getElementById('tournamentLogoPreview').src = event.target.result;
          document.getElementById('tournamentLogoDisplay').src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    });
    
    // Update team name displays when input changes
    document.getElementById('homeTeamName').addEventListener('input', function() {
      const name = this.value || 'HOME TEAM';
      document.getElementById('homeTeamNameDisplay').textContent = name;
      document.getElementById('homeTeamDisplay').textContent = name;
    });
    
    document.getElementById('awayTeamName').addEventListener('input', function() {
      const name = this.value || 'AWAY TEAM';
      document.getElementById('awayTeamNameDisplay').textContent = name;
      document.getElementById('awayTeamDisplay').textContent = name;
    });
    
    // Change theme
    document.getElementById('themeSelector').addEventListener('change', function() {
      const scoreboard = document.getElementById('scoreboard');
      scoreboard.className = 'scoring-board ' + this.value;
    });
    
    // Generate scoreboard from input data
    document.getElementById('generateBtn').addEventListener('click', function() {
      const tournamentName = document.getElementById('tournamentName').value || 'TOURNAMENT NAME';
      const tournamentDate = document.getElementById('tournamentDate').value || 'Date and Time Here';
      const referee = document.getElementById('referee').value || 'Referee Name';
      const streamer = document.getElementById('streamer').value || 'Streamer Name';
      const homeTeamName = document.getElementById('homeTeamName').value || 'HOME TEAM';
      const awayTeamName = document.getElementById('awayTeamName').value || 'AWAY TEAM';
      
      // Update header and footer
      document.querySelector('.header').textContent = tournamentName.toUpperCase();
      document.querySelector('.info-row').innerHTML = `<div>REF | ${referee}</div><div>${tournamentDate}</div><div>Streamer | ${streamer}</div>`;
      document.getElementById('homeTeamDisplay').textContent = homeTeamName;
      document.getElementById('awayTeamDisplay').textContent = awayTeamName;
      document.getElementById('homeTeamNameDisplay').textContent = homeTeamName;
      document.getElementById('awayTeamNameDisplay').textContent = awayTeamName;
      
      // Update lineup lists
      updateLineupDisplay('homeLineup', 'homeLineupDisplay');
      updateLineupDisplay('awayLineup', 'awayLineupDisplay');
      
      // Parse the format input if needed
      const formatText = document.getElementById('formatInput').value;
      if (formatText) {
        parseFormatInput(formatText);
      }
    });
    
    function updateLineupDisplay(inputId, displayId) {
      const lineupText = document.getElementById(inputId).value;
      const lineupList = document.getElementById(displayId);
      lineupList.innerHTML = '';
      
      if (lineupText) {
        const players = lineupText.split(',').map(p => p.trim());
        players.forEach(player => {
          if (player) {
            const li = document.createElement('li');
            li.textContent = player;
            lineupList.appendChild(li);
          }
        });
      }
    }
    
    // Parse the input format text
    function parseFormatInput(text) {
      const lines = text.split('\n');
      const data = {};
      let currentHomeScore = 0;
      let currentAwayScore = 0;
      
      // Extract basic info
      for (const line of lines) {
        if (line.startsWith('name_tour:')) {
          data.tournamentName = line.substring('name_tour:'.length).trim();
          document.getElementById('tournamentName').value = data.tournamentName;
        } else if (line.startsWith('date:')) {
          data.date = line.substring('date:'.length).trim();
          // Try to parse the date format if possible
          const dateMatch = data.date.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?/);
          if (dateMatch) {
            const [_, day, month, year, hours, minutes] = dateMatch;
            const dateObj = new Date(year, month-1, day, hours || 0, minutes || 0);
            
            // Update date picker
            document.getElementById('tournamentDatePicker').valueAsDate = dateObj;
            
            // Update time picker if time was included
            if (hours && minutes) {
              document.getElementById('tournamentTimePicker').value = 
                hours.padStart(2, '0') + ':' + minutes.padStart(2, '0');
            }
            
            // Update formatted date
            updateFormattedDateTime();
          } else {
            // If can't parse, just use as-is
            document.getElementById('tournamentDate').value = data.date;
            document.getElementById('formattedDateTime').textContent = data.date;
          }
          
        } else if (line.startsWith('ref:')) {
          data.referee = line.substring('ref:'.length).trim();
          document.getElementById('referee').value = data.referee;
        } else if (line.startsWith('streamer:')) {
          data.streamer = line.substring('streamer:'.length).trim();
          document.getElementById('streamer').value = data.streamer;
        } else if (line.startsWith('lineup_home:')) {
          data.lineupHome = line.substring('lineup_home:'.length).trim();
          document.getElementById('homeLineup').value = data.lineupHome;
        } else if (line.startsWith('lineup_away:')) {
          data.lineupAway = line.substring('lineup_away:'.length).trim();
          document.getElementById('awayLineup').value = data.lineupAway;
        } else if (line.startsWith('home_team_name:')) {
          data.homeTeamName = line.substring('home_team_name:'.length).trim();
          document.getElementById('homeTeamName').value = data.homeTeamName;
          document.getElementById('homeTeamNameDisplay').textContent = data.homeTeamName;
          document.getElementById('homeTeamDisplay').textContent = data.homeTeamName;
        } else if (line.startsWith('away_team_name:')) {
          data.awayTeamName = line.substring('away_team_name:'.length).trim();
          document.getElementById('awayTeamName').value = data.awayTeamName;
          document.getElementById('awayTeamNameDisplay').textContent = data.awayTeamName;
          document.getElementById('awayTeamDisplay').textContent = data.awayTeamName;
        }
      }
      
      // Extract scoring matches
      const scoringStartIndex = lines.findIndex(line => line.startsWith('scoring:'));
      const finalScoreIndex = lines.findIndex(line => line.startsWith('final_score:'));
      
      if (scoringStartIndex !== -1) {
        let endIndex = finalScoreIndex !== -1 ? finalScoreIndex : lines.length;
        const scoringLines = lines.slice(scoringStartIndex + 1, endIndex);
        data.matches = [];
        
        scoringLines.forEach(line => {
          if (line.trim() === '') return;
          
          // Parse a line like "Haibara Train UT 1 - 0 Hero FD Mikey"
          const parts = line.trim();
          const scoreRegex = /(\d+)\s*-\s*(\d+)/;
          const scoreMatch = parts.match(scoreRegex);
          
          if (scoreMatch) {
            const scoreBefore = parts.substring(0, scoreMatch.index).trim();
            const scoreAfter = parts.substring(scoreMatch.index + scoreMatch[0].length).trim();
            
            // Extract home player info (everything before the score)
            const homeWords = scoreBefore.split(' ');
            const homePlayer = homeWords[0];
            
            let homeDeck = '';
            let homeSkill = '';
            
            // If we have at least 3 words, assume format is "Player Deck Skill"
            if (homeWords.length >= 3) {
              homeSkill = homeWords[homeWords.length - 1];
              homeDeck = homeWords.slice(1, homeWords.length - 1).join(' ');
            } else if (homeWords.length === 2) {
              // If just 2 words, assume "Player Deck" format
              homeDeck = homeWords[1];
            }
            
            // Extract away player info (everything after the score)
            const awayWords = scoreAfter.split(' ');
            const awayPlayer = awayWords[awayWords.length - 1];
            
            let awayDeck = '';
            let awaySkill = '';
            
            // If we have at least 3 words, assume format is "Deck Skill Player"
            if (awayWords.length >= 3) {
              awaySkill = awayWords[awayWords.length - 2];
              awayDeck = awayWords.slice(0, awayWords.length - 2).join(' ');
            } else if (awayWords.length === 2) {
              // If just 2 words, assume "Deck Player" format
              awayDeck = awayWords[0];
            }
            
            // Parse the scores and determine winner
            const homeScore = parseInt(scoreMatch[1]);
            const awayScore = parseInt(scoreMatch[2]);
            
            // Update the current score
            currentHomeScore = homeScore;
            currentAwayScore = awayScore;
            
            // Determine the match winner (who scored the last point)
            const homeScoreDiff = homeScore - (data.matches.length > 0 ? data.matches[data.matches.length - 1].homeScoreAfter : 0);
            const awayScoreDiff = awayScore - (data.matches.length > 0 ? data.matches[data.matches.length - 1].awayScoreAfter : 0);
            
            const winner = homeScoreDiff > 0 ? 'home' : 'away';
            
            data.matches.push({
              homePlayer: homePlayer,
              homeDeck: homeDeck,
              homeSkill: homeSkill,
              awayPlayer: awayPlayer,
              awayDeck: awayDeck,
              awaySkill: awaySkill,
              homeScoreAfter: homeScore,
              awayScoreAfter: awayScore,
              winner: winner
            });
          }
        });
      }
      
      // Update the score display
      document.getElementById('homeScoreDisplay').textContent = currentHomeScore;
      document.getElementById('awayScoreDisplay').textContent = currentAwayScore;
      
      // Update the info row
      document.querySelector('.info-row').innerHTML = `<div>REF | ${data.referee || 'Referee Name'}</div><div>${data.date || document.getElementById('tournamentDate').value || 'Date and Time Here'}</div><div>Streamer | ${data.streamer || 'Streamer Name'}</div>`;
      
      // Generate match rows
      if (data.matches && data.matches.length > 0) {
        const tableBody = document.getElementById('scoreTableBody');
        tableBody.innerHTML = ''; // Clear existing rows
        
        data.matches.forEach((match, index) => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td>${match.homePlayer}</td>
            <td>${match.homeDeck}</td>
            <td>${match.homeSkill}</td>
            <td class="${match.winner === 'home' ? 'win-cell' : 'lose-cell'} score-cell">${match.winner === 'home' ? 'W' : 'L'}</td>
            <td class="${match.winner === 'away' ? 'win-cell' : 'lose-cell'} score-cell">${match.winner === 'away' ? 'W' : 'L'}</td>
            <td>${match.awaySkill}</td>
            <td>${match.awayDeck}</td>
            <td>${match.awayPlayer}</td>
          `;
          
          tableBody.appendChild(row);
        });
      }
      
      // Update lineup displays
      if (data.lineupHome) {
        updateLineupDisplay('homeLineup', 'homeLineupDisplay');
      }
      if (data.lineupAway) {
        updateLineupDisplay('awayLineup', 'awayLineupDisplay');
      }
      
      // Update team names if available
      if (data.homeTeamName) {
        document.getElementById('homeTeamName').value = data.homeTeamName;
        document.getElementById('homeTeamNameDisplay').textContent = data.homeTeamName;
        document.getElementById('homeTeamDisplay').textContent = data.homeTeamName;
      }
      
      if (data.awayTeamName) {
        document.getElementById('awayTeamName').value = data.awayTeamName;
        document.getElementById('awayTeamNameDisplay').textContent = data.awayTeamName;
        document.getElementById('awayTeamDisplay').textContent = data.awayTeamName;
      }
    }
    
    // Download image functionality
    document.getElementById('downloadBtn').addEventListener('click', function() {
      const scoreboard = document.getElementById('scoreboard');
      
      // Temporarily disable responsive styles for consistent image export
      const viewport = document.querySelector('meta[name="viewport"]');
      const originalContent = viewport.content;
      viewport.content = 'width=1000, initial-scale=1.0';
      
      // Add a consistent fixed width class for export
      scoreboard.classList.add('export-view');
      
      html2canvas(scoreboard, {
        backgroundColor: null,
        scale: 2,
        // Set width to ensure consistent output
        useCORS: true,
        logging: false
      }).then(canvas => {
        // Remove temporary class
        scoreboard.classList.remove('export-view');
        
        // Restore viewport
        viewport.content = originalContent;
        
        const link = document.createElement('a');
        link.download = 'tournament-scoreboard.jpg';
        
        // Convert to JPEG with high quality
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        link.href = imgData;
        link.click();
      });
    });
    
    // Add responsive adjustment for small screens
    function adjustForMobile() {
      const scoreboard = document.getElementById('scoreboard');
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        scoreboard.classList.add('mobile-view');
      } else {
        scoreboard.classList.remove('mobile-view');
      }
    }
    
    // Run on load and on resize
    window.addEventListener('resize', adjustForMobile);
    adjustForMobile();
    
    // Initialize the date time display on load
    updateFormattedDateTime();
  });