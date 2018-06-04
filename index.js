// Constants
const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require("./settings.json");
const request = require('request');
const funcs = require('./functions.js');
const prefix = settings.prefix;
const ytUser = settings.username;
const defaultRole = settings.defaultRole;
const staffRoles = settings.staffRoles;

// Variables
var commandList = [];
var rulesList = funcs.getRulesList();
var textList = [];
var pepper = false;
var doggy = false;
var rock = false;

// All the commands that users can execute.
commandList.push([prefix + "help", "Shows this list."]);
commandList.push([prefix + "rules", "Shows the server rules."])
commandList.push([prefix + "subcount", "Show the subscriber amount from Youtube."]);
commandList.push([prefix + "viewcount", "Shows the amount of views on Youtube."]);
commandList.push([prefix + "membercount", "Show the member amount from Discord."]);
commandList.push([prefix + "texteffects", "Shows the possible text effects."]);
commandList.push([prefix + "staff", "Show the staff list."]);
commandList.push([prefix + "memes", "Gives information about posting memes."]);
commandList.push([prefix + "youtube", "Link to YouTube channel."]);
commandList.push([prefix + "steam", "Link to Steam group."]);
commandList.push([prefix + "twitter", "Link to Twitter profile."]);
commandList.push([prefix + "patreon", "Link to Patreon page."]);
commandList.push([prefix + "discord", "Link to Discord server."]);
commandList.push([prefix + "facebook", "Link to Facebook page."]);
commandList.push([prefix + "twitch", "Link to Twitch channel."]);
commandList.push([prefix + "store", "Link to Merch store."]);
commandList.push([prefix + "shop", "Link to Merch store."]);
commandList.push([prefix + "merch", "Link to Merch store."]);
commandList.push([prefix + "searchVid 'Name of video'", "Search a video or SmashLook."]);

// Text-Effects
textList.push("*Italic*");
textList.push("**Bold**");
textList.push("__Underlined__");
textList.push("~~Striketrough~~");

// When the bot starts up, log it to the console.
client.on("ready", () => {
	console.log("I\'m Online");
	client.user.setActivity(prefix + "help");
});

// When a User joins the server for the first time.
client.on('guildMemberAdd', member => {
	// Private message with rules to User that joins.
	var rulesString = "**Rules:**\n";
	var tempString = "";

	for (var i = 0; i < rulesList.length; i++) {
		tempString = (i+1) + ") " + rulesList[i] + "\n";
		rulesString += tempString;
	}
	tempString = "\n\nYou can always use " + prefix + "help if you need information regarding the commands.";
	rulesString += tempString;
	member.user.send(rulesString);

	// Gives the new user the 'Smashers'-role.
	member.addRole(member.guild.roles.find('name', defaultRole));

	const channel = member.guild.channels.find('name', 'server_log');
	const embed = new Discord.RichEmbed();
	embed.setColor('80f31f');
	embed.setAuthor(member.user.username + "#" + member.user.discriminator + " (" + member.user.id + ")", member.user.displayAvatarURL);
	embed.setFooter('User joined');
	embed.setTimestamp();
	channel.send(embed);

	console.log("New user joined!");
});

//When a person leaves the server.
client.on('guildMemberRemove', member => {
	const channel = member.guild.channels.find('name', 'server_log');
	const embed = new Discord.RichEmbed();
	embed.setColor('ff2605');
	embed.setAuthor(member.user.username + "#" + member.user.discriminator + " (" + member.user.id + ")", member.user.displayAvatarURL);
	embed.setFooter('User left');
	embed.setTimestamp();
	channel.send(embed);

	console.log("User left!");
});

// Commands.
client.on("message", message => {

	if (message.author.id === "254533641382658048" && pepper == true) {
		message.react('🌶');
		console.log("Pepper");
	}

	if (message.author.id === "104618219347648512" && doggy == true) {
		message.react('🌭');
		console.log("Doggy");
	}

	if (message.author.id === "301711821981614082" && rock == true) {
		message.react('🇫');
		message.react('🇦');
		message.react('🇮');
		message.react('🇷');
		message.react('🇾');
		console.log("Rock");
	}

	if (message.author.id === "96651399605006336" && message.content === (prefix + "togglePepper")) {
		let msg = "Pepper is now: ";
		if (pepper == true) {
			pepper = false;
			msg += "false!";
		}
		else if (pepper == false) {
			pepper = true;
			msg += "true!";
		}
		message.channel.send(msg);
	}

	if (message.author.id === "96651399605006336" && message.content === (prefix + "toggleDoggy")) {
		let msg = "Doggy is now: ";
		if (doggy == true) {
			doggy = false;
			msg += "false!";
		}
		else if (doggy == false) {
			doggy = true;
			msg += "true!";
		}
		message.channel.send(msg);
	}

	if (message.author.id === "96651399605006336" && message.content === (prefix + "toggleRock")) {
		let msg = "Rock is now: ";
		if (rock == true) {
			rock = false;
			msg += "false!";
		}
		else if (rock == false) {
			rock = true;
			msg += "true!";
		}
		message.channel.send(msg);
	}

	// If message doesn't start with the prefix.
	if (!message.content.startsWith(prefix)) return;

	// If message is send from a bot.
	if (message.author.bot) return;

	// All custom commands
	switch (message.content) {
		case (prefix + "help"):
			var commandString = "__**Commands:**__\n";
			var tempString = "";

			for (var i = 0; i < commandList.length; i++) {
				tempString = "**" + commandList[i][0] + "**   " + commandList[i][1] + "\n";
				commandString += tempString;
			}
			message.channel.send(commandString);
			console.log("Command 'help' executed!");
			break;

		case (prefix + "rules"):
			var rulesString = "__**Rules:**__\n";
			var tempString = "";

			for (var i = 0; i < rulesList.length; i++) {
				tempString = (i+1) + ") " + rulesList[i] + "\n";
				rulesString += tempString;
			}
			message.channel.send(rulesString);
			console.log("Command 'rules' executed!");
			break;

		case (prefix + "subcount"):
			request({
			uri: `https://www.googleapis.com/youtube/v3/channels/?forUsername=${ytUser}&part=statistics&key=${process.env.API_KEY}`,
			json:true }, (err, res, body) => {
			if (err) return console.log(err);
			message.channel.send("The subscriber count is:\n**" + body.items[0].statistics.subscriberCount + "**");
			});
			console.log("Command 'subcount' executed!");
			break;

		case (prefix + "viewcount"):
			request({
			uri: `https://www.googleapis.com/youtube/v3/channels/?forUsername=${ytUser}&part=statistics&key=${process.env.API_KEY}`,
			json:true }, (err, res, body) => {
			if (err) return console.log(err);
			message.channel.send("The view count is:\n**" + body.items[0].statistics.viewCount + "**");
			console.log("Command 'viewcount' executed!")
			});
			break;

		case (prefix + "membercount"):
			message.channel.send("The member count is:\n**" + message.guild.memberCount + "**");
			console.log("Command 'membercount' executed!");
			break;

		case (prefix + "texteffects"):
			var textString = "__**Text-Effects**__\n";
			var tempString = "```\n";

			textString += tempString;
			for (var i = 0; i < textList.length; i++) {
				tempString = textList[i] + "\n";
				textString += tempString;
			}
			textString += "```\n";
			for (var i = 0; i < textList.length; i++) {
				tempstring = textList[i] + "\n";
				textString += tempstring;
			}

			message.channel.send(textString);
			console.log("Command 'texteffects' executed!");
			break;

		case (prefix + "staff"):
			var staffString = "__**Staff:**__\n";
			var tempString = "";

			for (var i = 0; i < staffRoles.length; i++) {

				var staffMembers = message.guild.roles.find("name", staffRoles[i]).members;
				var max = staffMembers.size;
				for (var j = 0; j < max; j++) {
					tempString = "**" + staffRoles[i] + "**: " + staffMembers.first().displayName + "\n";
					staffMembers.delete(staffMembers.firstKey());
					staffString += tempString;
				}
			}

			message.channel.send(staffString);
			console.log("Command 'staff' executed!");
			break;

		case (prefix + "help"):
			var commandString = "__**Commands:**__\n";
			var tempString = "";

			for (var i = 0; i < commandList.length; i++) {
				tempString = "**" + commandList[i][0] + "**   " + commandList[i][1] + "\n";
				commandString += tempString;
			}
			message.channel.send(commandString);
			console.log("Command 'help' executed!");
			break;

		case (prefix + "rules"):
			var rulesString = "__**Rules:**__\n";
			var tempString = "";

			for (var i = 0; i < rulesList.length; i++) {
				tempString = (i+1) + ") " + rulesList[i] + "\n";
				rulesString += tempString;
			}
			message.channel.send(rulesString);
			console.log("Command 'rules' executed!");
			break;

		case (prefix + "subcount"):
			request({
			uri: `https://www.googleapis.com/youtube/v3/channels/?forUsername=${ytUser}&part=statistics&key=${process.env.API_KEY}`,
			json:true }, (err, res, body) => {
			if (err) return console.log(err);
			message.channel.send("The subscriber count is:\n**" + body.items[0].statistics.subscriberCount + "**");
			console.log("Command 'subcount' executed!")
			});
			break;

		case (prefix + "viewcount"):
			request({
			uri: `https://www.googleapis.com/youtube/v3/channels/?forUsername=${ytUser}&part=statistics&key=${process.env.API_KEY}`,
			json:true }, (err, res, body) => {
			if (err) return console.log(err);
			message.channel.send("The view count is:\n**" + body.items[0].statistics.viewCount + "**");
			console.log("Command 'viewcount' executed!")
			});
			break;

		case (prefix + "membercount"):
			message.channel.send("The member count is:\n**" + message.guild.memberCount + "**");
			console.log("Command 'membercount' executed!");
			break;

		case (prefix + "texteffects"):
			var textString = "__**Text-Effects**__\n";
			var tempString = "```\n";

			textString += tempString;
			for (var i = 0; i < textList.length; i++) {
				tempString = textList[i] + "\n";
				textString += tempString;
			}
			textString += "```\n";
			for (var i = 0; i < textList.length; i++) {
				tempstring = textList[i] + "\n";
				textString += tempstring;
			}

			message.channel.send(textString);
			console.log("Command 'texteffects' executed!");
			break;

		case (prefix + "staff"):
			var staffString = "__**Staff:**__\n";
			var tempString = "";

			for (var i = 0; i < staffRoles.length; i++) {

				var staffMembers = message.guild.roles.find("name", staffRoles[i]).members;
				var max = staffMembers.size;
				for (var j = 0; j < max; j++) {
					tempString = "**" + staffRoles[i] + "**: " + staffMembers.first().displayName + "\n";
					staffMembers.delete(staffMembers.firstKey());
					staffString += tempString;
				}
			}

			message.channel.send(staffString);
			console.log("Command 'staff' executed!");
			break;

		case (prefix + "memes"):
			message.reply("Be careful with what you post. You are responsible for the contents of your post. If you post an image and the content of it is against the rules, then you will be the one responsible for it.");
			console.log("Command 'memes' executed!");
			break;

		case (prefix + "youtube"):
			message.reply("You can find SmashGaming's youtube channel here:\nhttps://www.youtube.com/user/SmashGaming999");
			console.log("Command 'youtube' executed!");
			break;

		case (prefix + "steam"):
			message.reply("Join our steam group on:\nhttp://steamcommunity.com/groups/SmashGmainG");
			console.log("Command 'steam' executed!");
			break;

		case (prefix + "twitter"):
			message.reply("Check my twitter on:\nhttps://twitter.com/Frazzz101");
			console.log("Command 'twitter' executed!");
			break;

		case (prefix + "patreon"):
			message.reply("Check my patreon on:\nhttps://www.patreon.com/smashgaming999");
			console.log("Command 'patreon' executed!");
			break;

		case (prefix + "discord"):
			message.reply("Join us on discord:\nhttps://discord.gg/zwEVdFE");
			console.log("Command 'discord' executed!");
			break;

		case (prefix + "facebook"):
			message.reply("Find us on Facebook:\nhttps://www.facebook.com/SmashGaming999/");
			console.log("Command 'facebook' executed!");
			break;

		case (prefix + "twitch"):
			message.reply("Check out my Twitch on:\nhttps://www.twitch.tv/smashgamingfrazzz");
			console.log("Command 'twitch' executed!");
			break;
		case (prefix + "links"):
			const embed = new Discord.RichEmbed();
			embed.setColor('e88317');
			embed.setAuthor('SmashGaminG!! Links');
			embed.setThumbnail('https://art.pixilart.com/cd8f72c899620a4.png');
			embed.setFooter('Thumbnail made by Violet');
			embed.addField('Youtube', 'https://www.youtube.com/user/SmashGaming999');
			embed.addField('Twitch', 'https://www.twitch.tv/smashgamingfrazzz');
			embed.addField('Patreon', 'https://www.patreon.com/smashgaming999');
			embed.addField('Merch', 'https://www.redbubble.com/people/SmashGaminG/shop');
			embed.addField('Humble partner', 'https://www.humblebundle.com/store?partner=smashgaming');
			embed.addField('Youtube Sponsoring', 'https://goo.gl/qZYGxk');
			embed.addField('Steam', 'http://steamcommunity.com/groups/SmashGmainG');
			embed.addField('Twitter', 'https://twitter.com/Frazzz101');
			embed.addField('Facebook', 'https://www.facebook.com/SmashGaming999/');
			embed.addField('Instagram', 'https://www.instagram.com/smash_gaming_frazzz/');
			embed.addField('Discord', 'https://discord.gg/zwEVdFE');

			message.channel.send(embed);
			break;

		case (prefix + "store"):
		case (prefix + "shop"):
		case (prefix + "merch"):
			message.reply("Check out my awesome merch:\nhttps://www.redbubble.com/people/SmashGaminG/shop");
			console.log("Command 'store', 'shop', 'merch' executed!");
			break;
		default:
			var cmd = message.content.substr(0,message.content.indexOf(' '));
			var arg = message.content.substr(message.content.indexOf(' ')+1);
			if (cmd === (prefix + "searchVid")) {
				request({
				uri: `https://www.googleapis.com/youtube/v3/search/?part=snippet&channelId=UCfYQJa2qGuCy6z87UBHhA8A&order=date&type=video&key=${process.env.API_KEY}&q=${arg}`,
				json:true }, (err, res, body) => {
				if (err) return console.log(err);
				if (body.items[0] !== undefined) {
					message.channel.send("**" + body.items[0].snippet.title + "**\nhttps://www.youtube.com/watch?v=" + body.items[0].id.videoId);
					console.log("Command 'searchVid' executed!")
				}
				else {
					message.channel.send("The video could not be found.");
				}
				});
			}
			break;
	}
});

client.login(process.env.BOT_TOKEN);
