// roafit-coach-sender.js
// Envia los datos de los trackers a ROA FIT mediante los formularios de Brevo.

(function() {
    'use strict';

    const BREVO_FORMS = {
        base: 'https://02c40dc8.sibforms.com/serve/MUIFACSO3k0fwi1LfUxoZ8dvvKRHmL9jfAx31KGnSd__Gf9dfq88lDk1v1v39nZKOO37hEK4zTa9UueMV1MuPMHg9DB6-PZsF8vhPFBMEUubDr7_rFeSaQedQC5oNMSxjtSNhFr7LWZLBHfP37rSDdH3ss4ke0Gim_mYixMzVvDjvmP6AF2pRg4dtSAI5rstERi-2vS2Zyls3sol9w==',
        comunidad: 'https://02c40dc8.sibforms.com/serve/MUIFAO-QiVWySchTQA0J9mIxdlFt-HhDDsuoM91AfzEeN5sGSwToUKg8WfR0AL1EhsWsF6H12pHxH6xbIdyvhvTVw_-v2Ic5IaUTIC2PDgLuyPbSjZNtcyRLtf8YgcBb_Gq4v8L1N1wr2TlnxJbH6eAeKS08RjQlC4SSyxJgUbOmv2gTSFmc8fr8oDCoZQV-HOUcw2otWZTD7EZh7w=='
    };
    const ORIGEN_POR_TIPO = { habitos: 'Tracker hábitos', entrenamiento: 'Tracker entrenamiento', nutricion: 'Tracker nutricional', calorias: 'Calculadora calorías', general: 'Herramienta web' };

    // Crear el botón "Enviar a mi coach"
    function createCoachButton() {
        const button = document.createElement('button');
        button.id = 'sendToCoachBtn';
        button.innerHTML = 'Enviar a mi Coach';
        button.style.cssText = `
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.1em;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            margin: 20px 0;
            transition: transform 0.3s, box-shadow 0.3s;
            width: 100%;
            max-width: 400px;
        `;
        
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
        
        button.addEventListener('click', openCoachModal);
        
        return button;
    }

    // Crear el modal de contacto
    function createCoachModal() {
        const modalHTML = `
            <div id="coachModal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); overflow: auto;">
                <div style="background: white; margin: 50px auto; padding: 40px; border-radius: 20px; max-width: 500px; position: relative; animation: slideIn 0.3s;">
                    <span id="closeModal" style="position: absolute; top: 15px; right: 20px; font-size: 28px; font-weight: bold; cursor: pointer; color: #666;">&times;</span>
                    
                    <h2 style="color: #1a1a1a; margin-bottom: 10px;">Enviar a mi Coach</h2>
                    <p style="color: #666; margin-bottom: 30px;">¿Te gustaría recibir seguimiento personalizado? Completa estos datos y te contactaré para ayudarte.</p>
                    
                    <form id="coachContactForm">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                Nombre completo <span style="color: #e74c3c;">*</span>
                            </label>
                            <input type="text" id="coachNombre" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                Email <span style="color: #e74c3c;">*</span>
                            </label>
                            <input type="email" id="coachEmail" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                WhatsApp
                            </label>
                            <input type="tel" id="coachWhatsapp" placeholder="+34 600 000 000" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                            <small style="color: #666; font-size: 0.9em;">Con código de país (opcional)</small>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                ¿Qué te gustaría lograr?
                            </label>
                            <textarea id="coachObjetivo" rows="3" placeholder="Ejemplo: Perder grasa, ganar músculo, crear hábito de entrenar..." style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
                        </div>
                        
                        <div style="margin-bottom: 12px; font-size: 0.9em; color: #333; text-align:left;">
                            <label style="display:flex; gap:8px; align-items:flex-start; cursor:pointer;"><input type="checkbox" id="coachConsent" required style="margin-top:3px;"><span>Acepto la <a href="../privacidad.html" target="_blank" style="color:#b38f00;">política de privacidad</a> y doy mi consentimiento explícito para que ROA FIT trate los datos de este tracker (pueden incluir información de salud) para responderme. <span style="color: #e74c3c;">*</span></span></label>
                        </div>
                        <div style="margin-bottom: 25px; font-size: 0.9em; color: #333; text-align:left;">
                            <label style="display:flex; gap:8px; align-items:flex-start; cursor:pointer;"><input type="checkbox" id="coachComunidad" style="margin-top:3px;"><span>Quiero unirme a la Comunidad ROAFIT y recibir emails con contenido y herramientas gratuitas (opcional).</span></label>
                        </div>
                        <input type="text" id="coachHoney" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:0;height:0;opacity:0">
                        
                        <button type="submit" id="sendCoachBtn" style="background: linear-gradient(135deg, #F2CB05 0%, #ffd700 100%); color: #1a1a1a; border: none; padding: 15px 30px; font-size: 1.1em; font-weight: bold; border-radius: 10px; cursor: pointer; width: 100%;">
                            Enviar Datos
                        </button>
                    </form>
                    
                    <div id="coachSuccessMsg" style="display: none; background: #10b981; color: white; padding: 20px; border-radius: 10px; text-align: center; margin-top: 20px;">
                        <h3 style="margin-bottom: 10px;">✅ ¡Datos enviados correctamente!</h3>
                        <p style="margin: 0;">He recibido tu información. Te llegará un email de confirmación y te responderé en las próximas 48 horas.</p>
                        <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.9;">¡Gracias por tu interés!</p>
                    </div>
                    
                    <div id="coachErrorMsg" style="display: none; background: #e74c3c; color: white; padding: 20px; border-radius: 10px; text-align: center; margin-top: 20px;">
                        <h3 style="margin-bottom: 10px;">❌ Error al enviar</h3>
                        <p style="margin: 0;">Hubo un problema. Por favor, intenta de nuevo o contáctame por Instagram.</p>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes slideIn {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            </style>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Event listeners para cerrar modal
        document.getElementById('closeModal').addEventListener('click', closeCoachModal);
        document.getElementById('coachModal').addEventListener('click', function(e) {
            if (e.target.id === 'coachModal') {
                closeCoachModal();
            }
        });
        
        // Event listener para el formulario
        document.getElementById('coachContactForm').addEventListener('submit', handleCoachFormSubmit);
    }

    // Abrir modal
    function openCoachModal() {
        document.getElementById('coachModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Cerrar modal
    function closeCoachModal() {
        document.getElementById('coachModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Exportar datos del tracker actual
    function exportTrackerData(trackerType) {
        const data = exportTrackerDataObject(trackerType);
        return JSON.stringify(data, null, 2);
    }
    
    // Exportar datos del tracker como objeto
    function exportTrackerDataObject(trackerType) {
        const data = {
            trackerType: trackerType,
            fecha: new Date().toLocaleString('es-ES'),
            datos: {},
            resumen: ''
        };
        
        // Obtener datos del localStorage según el tipo de tracker
        switch(trackerType) {
            case 'habitos':
                const habitData = JSON.parse(localStorage.getItem('fitnessTracker') || '{}');
                data.datos = habitData;
                data.resumen = crearResumenHabitos(habitData);
                break;
            case 'entrenamiento':
                const workoutData = JSON.parse(localStorage.getItem('gymWorkoutTracker') || '{}');
                data.datos = workoutData;
                data.resumen = crearResumenEntrenamiento(workoutData);
                break;
            case 'nutricion':
                const nutritionData = JSON.parse(localStorage.getItem('nutritionTracker') || '{}');
                data.datos = nutritionData;
                data.resumen = crearResumenNutricion(nutritionData);
                break;
            case 'calorias':
                const calorieData = JSON.parse(localStorage.getItem('calorieData') || '{}');
                data.datos = calorieData;
                data.resumen = crearResumenCalorias(calorieData);
                break;
            default:
                data.datos = { mensaje: 'Datos del tracker' };
                data.resumen = 'Interesado en el servicio';
        }
        
        return data;
    }
    
    // Crear resumen legible de hábitos
    function crearResumenHabitos(habitData) {
        if (!habitData.checks || Object.keys(habitData.checks).length === 0) {
            return 'Sin datos registrados en el tracker';
        }
        
        const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
        const estrategias = {
            '1': 'Estrategia #1: La Regla de los 2 Minutos',
            '2': 'Estrategia #2: Imperfección Productiva',
            '3': 'Estrategia #3: Ancla de Hábitos'
        };
        
        // Organizar datos por estrategia y semana
        const datosOrganizados = {};
        Object.keys(habitData.checks).forEach(key => {
            const [estrategia, semana, dia] = key.split('-');
            if (!datosOrganizados[estrategia]) {
                datosOrganizados[estrategia] = {};
            }
            if (!datosOrganizados[estrategia][semana]) {
                datosOrganizados[estrategia][semana] = [];
            }
            datosOrganizados[estrategia][semana].push(parseInt(dia));
        });
        
        let resumen = '\n📋 TRACKER DE HÁBITOS - RESUMEN VISUAL\n';
        resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        
        // Para cada estrategia usada
        Object.keys(datosOrganizados).forEach(estrategia => {
            resumen += `📍 ${estrategias[estrategia]}\n`;
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            let totalDias = 0;
            const semanas = datosOrganizados[estrategia];
            
            // Para cada semana
            for (let s = 1; s <= 4; s++) {
                const diasMarcados = semanas[s] || [];
                const numDias = diasMarcados.length;
                totalDias += numDias;
                const porcentaje = Math.round((numDias / 7) * 100);
                
                resumen += `📅 Semana ${s}: ${numDias} de 7 días completados (${porcentaje}%)\n`;
                resumen += '   ';
                
                // Mostrar cada día de la semana
                for (let d = 0; d < 7; d++) {
                    if (diasMarcados.includes(d)) {
                        resumen += `${dias[d]} ✅  `;
                    } else {
                        resumen += `${dias[d]} ⬜  `;
                    }
                }
                resumen += '\n\n';
            }
            
            const totalPosible = 28;
            const porcentajeTotal = Math.round((totalDias / totalPosible) * 100);
            resumen += `📊 TOTAL: ${totalDias} días completados de ${totalPosible} posibles (${porcentajeTotal}%)\n`;
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        });
        
        // Agregar notas si existen
        if (habitData.notes && habitData.notes.trim()) {
            resumen += '💭 REFLEXIONES DEL USUARIO:\n';
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            resumen += habitData.notes + '\n';
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        }
        
        return resumen;
    }
    
    // Crear resumen legible del tracker de entrenamiento
    function crearResumenEntrenamiento(workoutData) {
        if (!workoutData || Object.keys(workoutData).length === 0) {
            return 'Sin datos registrados en el tracker';
        }
        
        let resumen = '\n💪 TRACKER DE ENTRENAMIENTO - RESUMEN VISUAL\n';
        resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        
        const diasNombres = {
            'day1': '🏋️ DÍA 1: TREN SUPERIOR',
            'day2': '🦵 DÍA 2: TREN INFERIOR',
            'day3': '💫 DÍA 3: CORE/ABDOMEN'
        };
        
        // Recorrer todas las semanas registradas
        Object.keys(workoutData).forEach(semanaNum => {
            const semanaData = workoutData[semanaNum];
            
            resumen += `📅 SEMANA ${semanaNum}\n`;
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            // Para cada día de entrenamiento
            ['day1', 'day2', 'day3'].forEach(diaKey => {
                if (semanaData[diaKey] && semanaData[diaKey].exercises) {
                    resumen += `${diasNombres[diaKey]}\n\n`;
                    
                    semanaData[diaKey].exercises.forEach((ejercicio, idx) => {
                        if (ejercicio.name || ejercicio.series.some(s => s.reps || s.weight)) {
                            resumen += `   ${idx + 1}. ${ejercicio.name || 'Sin nombre'}\n`;
                            
                            // Mostrar series
                            ejercicio.series.forEach((serie, sIdx) => {
                                if (serie.reps || serie.weight) {
                                    resumen += `      Serie ${sIdx + 1}: ${serie.reps || '-'} reps x ${serie.weight || '-'} kg\n`;
                                }
                            });
                            
                            // Mostrar comentarios si existen
                            if (ejercicio.comments && ejercicio.comments.trim()) {
                                resumen += `      💬 ${ejercicio.comments}\n`;
                            }
                            resumen += '\n';
                        }
                    });
                    
                    resumen += '\n';
                }
            });
            
            // Agregar cardio si existe
            if (semanaData.cardio && semanaData.cardio.trim()) {
                resumen += '🏃 ACTIVIDAD CARDIOVASCULAR:\n';
                resumen += semanaData.cardio + '\n\n';
            }
            
            // Agregar notas generales si existen
            if (semanaData.notes && semanaData.notes.trim()) {
                resumen += '📝 NOTAS GENERALES DE LA SEMANA:\n';
                resumen += semanaData.notes + '\n\n';
            }
            
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        });
        
        return resumen;
    }
    
    // Crear resumen legible de la calculadora de calorías
    function crearResumenCalorias(calorieData) {
        if (!calorieData || !calorieData.tdee) {
            return 'Sin datos calculados';
        }
        
        let resumen = '\n🔢 CALCULADORA DE CALORÍAS - RESULTADOS\n';
        resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        
        resumen += '👤 DATOS PERSONALES:\n';
        resumen += `   Sexo: ${calorieData.sexo === 'hombre' ? 'Hombre' : 'Mujer'}\n`;
        resumen += `   Edad: ${calorieData.edad} años\n`;
        resumen += `   Peso: ${calorieData.peso} kg\n`;
        resumen += `   Altura: ${calorieData.altura} cm\n`;
        resumen += `   Nivel de actividad: ${calorieData.actividad}\n`;
        resumen += `   Objetivo: ${calorieData.objetivo}\n\n`;
        
        resumen += '📊 RESULTADOS CALCULADOS:\n';
        resumen += `   Metabolismo Basal (TMB): ${calorieData.tmb} kcal/día\n`;
        resumen += `   Gasto Total Diario (TDEE): ${calorieData.tdee} kcal/día\n\n`;
        
        resumen += '🎯 RECOMENDACIONES CALÓRICAS:\n';
        if (calorieData.calorias) {
            resumen += `   Conservador: ${calorieData.calorias.conservador} kcal/día\n`;
            resumen += `   Moderado: ${calorieData.calorias.moderado} kcal/día\n`;
            if (calorieData.calorias.agresivo) {
                resumen += `   Agresivo: ${calorieData.calorias.agresivo} kcal/día\n`;
            }
        }
        
        resumen += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        resumen += `Calculado el: ${calorieData.fecha}\n`;
        resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        
        return resumen;
    }
    
    // Crear resumen legible de objetivos nutricionales
    function crearResumenNutricion(nutritionData) {
        if (!nutritionData || Object.keys(nutritionData).length === 0) {
            return 'Sin objetivos registrados';
        }
        
        let resumen = '\n🥗 TRACKER DE OBJETIVOS NUTRICIONALES - RESUMEN\n';
        resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        
        const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
        
        // Recorrer todas las semanas
        Object.keys(nutritionData).forEach(semanaNum => {
            const semanaData = nutritionData[semanaNum];
            
            resumen += `📅 SEMANA ${semanaNum}\n`;
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            // Mostrar cada objetivo
            semanaData.objectives.forEach((obj, idx) => {
                if (obj.text && obj.text.trim()) {
                    const diasCompletados = obj.days.filter(d => d).length;
                    const porcentaje = Math.round((diasCompletados / 7) * 100);
                    
                    resumen += `${idx + 1}. ${obj.text}\n`;
                    resumen += `   Progreso: ${diasCompletados}/7 días (${porcentaje}%)\n`;
                    resumen += '   ';
                    
                    // Mostrar cada día
                    obj.days.forEach((completado, diaIdx) => {
                        if (completado) {
                            resumen += `${dias[diaIdx]} ✅  `;
                        } else {
                            resumen += `${dias[diaIdx]} ⬜  `;
                        }
                    });
                    resumen += '\n\n';
                }
            });
            
            // Agregar notas si existen
            if (semanaData.notes && semanaData.notes.trim()) {
                resumen += '📝 REFLEXIONES DE LA SEMANA:\n';
                resumen += semanaData.notes + '\n\n';
            }
            
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        });
        
        return resumen;
    }

    // Manejar envío del formulario
    function handleCoachFormSubmit(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('sendCoachBtn');
        if (document.getElementById('coachHoney').value) return;
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Enviando...';

        const nombre = document.getElementById('coachNombre').value.trim();
        const email = document.getElementById('coachEmail').value.trim();
        const whatsapp = document.getElementById('coachWhatsapp').value.trim() || 'No proporcionado';
        const objetivo = document.getElementById('coachObjetivo').value.trim() || 'No especificado';
        const comunidad = document.getElementById('coachComunidad').checked;

        const p = window.location.pathname;
        let trackerType = 'general';
        if (/habitos/i.test(p)) trackerType = 'habitos';
        else if (/entrenamiento/i.test(p)) trackerType = 'entrenamiento';
        else if (/alimentacion|nutricion/i.test(p)) trackerType = 'nutricion';
        else if (/calorias/i.test(p)) trackerType = 'calorias';

        let resumen = '';
        try { resumen = exportTrackerDataObject(trackerType).resumen || ''; } catch (err) { resumen = ''; }
        // Brevo admite máx. 500 caracteres en MENSAJE: compactamos el resumen
        resumen = resumen.replace(/[━═─]+/g, '').replace(/[^\S\n]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
        let mensaje = '[' + ORIGEN_POR_TIPO[trackerType] + '] ' + objetivo + ' | WA: ' + whatsapp + (resumen ? ' | ' + resumen.replace(/\n/g, ' · ') : '');
        if (mensaje.length > 490) mensaje = mensaje.slice(0, 489) + '…';

        const fd = new FormData();
        fd.append('EMAIL', email); fd.append('NOMBRE', nombre); fd.append('MENSAJE', mensaje);
        fd.append('email_address_check', ''); fd.append('locale', 'es');

        const ok = function() {
            document.getElementById('coachContactForm').style.display = 'none';
            document.getElementById('coachSuccessMsg').style.display = 'block';
            submitBtn.disabled = false; submitBtn.textContent = 'Enviar Datos';
            setTimeout(function() {
                closeCoachModal();
                document.getElementById('coachContactForm').reset();
                document.getElementById('coachContactForm').style.display = 'block';
                document.getElementById('coachSuccessMsg').style.display = 'none';
            }, 4000);
        };
        const fail = function() {
            submitBtn.disabled = false; submitBtn.textContent = 'Enviar Datos';
            document.getElementById('coachErrorMsg').style.display = 'block';
            setTimeout(function() { document.getElementById('coachErrorMsg').style.display = 'none'; }, 5000);
        };
        fetch(comunidad ? BREVO_FORMS.comunidad : BREVO_FORMS.base, { method: 'POST', body: fd })
            .then(function(r) { return r.json(); })
            .then(function(j) { if (j && j.success) ok(); else fail(); })
            .catch(fail);
    }

    // Función de inicialización pública
    window.RoafitCoachSender = {
        init: function(buttonContainerId) {
            
            // Crear y añadir botón
            const container = document.getElementById(buttonContainerId);
            if (container) {
                const button = createCoachButton();
                container.appendChild(button);
            }
            
            // Crear modal
            createCoachModal();
        }
    };
})();
