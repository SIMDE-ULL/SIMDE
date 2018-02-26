import * as React from 'react';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { connect } from 'react-redux';
import { toggleLoadModal } from '../../actions/modals';
import { bindActionCreators } from 'redux';


declare var window: any;

class FileBarComponent extends React.Component<any, any> {
    private color: boolean;

    constructor(public props: any, public state: any) {
        super(props);
        this.color = false;
    }

    render() {
        return (<div className='filebar'>
            <nav className='navbar'>
                <ul className='nav navbar-nav'>
                    <li className='dropdown'>
                        <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>{t('fileBar.file.name')}</a>
                        <ul className='dropdown-menu'>
                            <li><a onClick={() => { this.props.actions.toggleLoadModal(true) }}>{t('fileBar.file.load')}</a></li>
                        </ul>
                    </li>
                </ul>
                <ul className='nav navbar-nav'>
                    <li className='dropdown'>
                        <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>{t('fileBar.view.name')}</a>
                        <ul className='dropdown-menu'>
                            <li><a onClick={() => {
                                this.color = !this.color;
                                window['colorBlocks'](this.color);
                            }}>{t('fileBar.view.basicBlocks')}</a></li>
                        </ul>
                    </li>
                </ul>
                <ul className='nav navbar-nav'>
                    <li className='dropdown'>
                        <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>{t('fileBar.config.name')}</a>
                        <ul className='dropdown-menu'>
                            <li><a onClick={() => { window['superConfigModal'](true); }}>{t('fileBar.config.superescalar')}</a></li>
                            <li><a onClick={() => { window['options'](true); }}>{t('fileBar.config.options')}</a></li>
                        </ul>
                    </li>
                </ul>
                <ul className='nav navbar-nav'>
                    <li className='dropdown'>
                        <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>{t('fileBar.execute.name')}</a>
                        <ul className='dropdown-menu'>
                            <li onClick={() => window.play()}><a>{t('fileBar.execute.init')}</a></li>
                            <li onClick={() => window.pause()}><a>{t('fileBar.execute.pause')}</a></li>
                            <li onClick={() => window.stop()}><a>{t('fileBar.execute.stop')}</a></li>
                            <li onClick={() => window.stepBack()}><a>{t('fileBar.execute.back')}</a></li>
                            <li onClick={() => window.superStep()}><a>{t('fileBar.execute.forward')}</a></li>
                        </ul>
                    </li>
                </ul>
                <ul className='nav navbar-nav'>
                    <li className='dropdown'>
                        <a className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>{t('fileBar.help.name')}</a>
                        <ul className='dropdown-menu'>
                            <li><a href='http://adrianabreu.com/SIMDE-Docs/' target='_blank'>{t('fileBar.help.docs')}</a></li>
                            <li><a onClick={() => { window['autorModal'](true); }}>{t('fileBar.help.about')}</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        isLoadModalOpen: state.isLoadModalOpen,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({toggleLoadModal}, dispatch)};
}


export default translate('common', { wait: true })(connect(mapStateToProps,mapDispatchToProps)(FileBarComponent));
